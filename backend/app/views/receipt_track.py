from PIL.Image import Image
from django.contrib.auth import password_validation
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework import permissions, renderers, viewsets
from rest_framework.decorators import action, permission_classes
from django.contrib.auth import get_user_model, logout
from rest_framework.response import Response
from app.models import *
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from app.serializers import *
from django.contrib import auth
from pdf2image import convert_from_path
from django.db import connection
from django.core.files.storage import FileSystemStorage
import pytesseract
import matplotlib.pyplot as plt
from imutils.perspective import four_point_transform
import imutils
from PIL.ExifTags import TAGS
import fitz
import cv2
from PIL import Image
import re
import numpy as np
import shutil
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, throttle_classes

#This API will be used primarily on the tracking page to generate new receipts for either incomes or expenses.  It will also be used
#to retrieve, update, and delete receipts.  It combines the user, receipts, expenses, incomes, and category tables.
#When a user retrieves a receipt, the underlying expenses and incomes associated should also be included.  

#Get, update, or delete a specific receipt and its content
@api_view(['GET', 'PUT', 'DELETE'])
def singleReceipt(request, receiptid):
    receipt = Receipt.objects.filter(receipt_id = receiptid)
    if receipt.count() == 0:
        return Response("A receipt with the provided id does not exist.")
    else:
        incomes = Income.objects.filter(receipt = receipt.first())
        expenses = Expense.objects.filter(receipt = receipt.first())
        if request.method == 'GET':
            out = {'incomes': incomes.values(),
                    'expenses': expenses.values(),
                    'receipt': receipt.values()[0]}
            return Response(out)
        elif request.method == 'DELETE':
            incomes.delete()
            expenses.delete()
            receipt.delete()
            return Response(f"Receipt with id {receiptid} and its content have been deleted.")
        else:
            recSerializer = ReceiptSerializer(data = request.data['receipt'])
            recSerializer.is_valid(raise_exception=True)
            recData = recSerializer.validated_data
            receipt.update(**recData)
            is_income = None
            serializer = None
            if request.data['incomes']:
                for income in request.data['incomes']:
                    Income.objects.filter(income_id=income['income_id']).update(
                    income_name = income['income_name'],
                    income_amount = income['income_amount'],
                    receipt = receiptid,
                    category = income['category'])
            elif request.data['expenses']:
                for expense in request.data['expenses']:
                    Expense.objects.filter(product_id=expense['product_id']).update(
                    product_name = expense['product_name'],
                    product_price = expense['product_price'],
                    receipt = receiptid,
                    category = expense['category'],
                    essential = expense['essential'])  
            return Response(f"Receipt with id {receiptid} has been updated.")
    
    

#Get all receipts for a user and its content
@api_view(["GET"])
def getReceiptsByUser(request, userid):

    user = Users.objects.get(user_id = userid)

    allReceipts = Receipt.objects.filter(user = user)[:20]

    incomeReceipts = Income.objects.select_related('receipt').filter(receipt__user = user)
    
    expenseReceipts = Expense.objects.select_related('receipt').filter(receipt__user = user)        
    out = []
    for rec in allReceipts:
        object = {'incomes': incomeReceipts.filter(receipt__receipt_id = rec.receipt_id).values(),
                    'expenses': expenseReceipts.filter(receipt__receipt_id = rec.receipt_id).values()}
        object['receipt'] = Receipt.objects.filter(receipt_id = rec.receipt_id).values()[0]
        out.append(object)

    return Response(out)

#Create a new receipt:
#Internally, this means that we are creating one entry in the Receipts table along with one or more records in the 
#Incomes and/or Expenses table (depending on the type of receipt provided in the body.)
@api_view(["POST"])
def postReceipt(request):
    is_income = None
    serializer = None
    if request.data['incomes']:
        is_income = True
        serializer = IncomeReceiptSerializer(data=request.data,
                                        context={'request': request})
    elif request.data['expenses']:
        serializer = ExpenseReceiptSerializer(data=request.data,
                                        context={'request': request})

    serializer.is_valid(raise_exception=True)
    receiptPackage = serializer.validated_data
    userid = request.data['userid']
    user = Users.objects.get(user_id = userid)

    #1. Create the receipt object
    recData = receiptPackage['receipt']
    #1. Create the receipt object
    receipt = Receipt.objects.create(receipt_amount = recData['receipt_amount'], 
    receipt_date = recData['receipt_date'],
    receipt_is_reccuring = recData['receipt_is_reccuring'],
    receipt_is_income = recData['receipt_is_income'],
    user = user)

    #2. Create the corresponding expense and/or income objects
    if is_income:
        for income in receiptPackage['incomes']:
            Income.objects.create(income_name = income['income_name'],
            income_amount = income['income_amount'],
            receipt = receipt,
            category = income['category'])
    else:
        for expense in receiptPackage['expenses']:
            Expense.objects.create(product_name = expense['product_name'],
            product_price = expense['product_price'],
            receipt = receipt,
            category = expense['category'],
            essential = expense['essential'])   
    
    return Response({
        'receipt_id': receipt.receipt_id
    })