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

            if recData.get('receipt_is_income'):
                Expense.objects.all().filter(receipt_id = receiptid).delete()
            elif not request.data.get('receipt_is_income'):
                Income.objects.all().filter(receipt_id = receiptid).delete()
            
            if request.data.get('incomes') and recData.get('receipt_is_income'):
                cur = list(Income.objects.filter(receipt_id = receiptid).values('income_id'))
                cur = [i.get('income_id') for i in cur]
                for income in request.data['incomes']:
                    query = Income.objects.filter(income_id=income.get('income_id'))
                    if query.count() == 0:
                        query.create(
                    **income,
                    receipt_id = receiptid,
                    )
                    else:
                        query.update(
                    **income,
                    receipt_id = receiptid,
                    )
                    cur = [i for i in cur if i != income.get('income_id')]
                # Remove any associated incomes not included in the package    
                Income.objects.filter(income_id__in = cur).delete()
            elif request.data.get('expenses') and not recData.get('receipt_is_income'):
                cur2 = list(Expense.objects.filter(receipt_id = receiptid).values('expense_id'))
                cur2 = [i.get('expense_id') for i in cur2]
                for expense in request.data['expenses']:
                    query = Expense.objects.filter(expense_id=expense.get('expense_id'))
                    if query.count() == 0:
                        query.create(
                    **expense,
                    receipt_id = receiptid)  
                    else:
                        query.update(
                    **expense,
                    receipt_id = receiptid)  
                    cur2 = [i for i in cur2 if i != expense.get('expense_id')]
                # Remove any associated expenses not included in the package
                Expense.objects.filter(expense_id__in = cur2).delete()
            return Response(f"Receipt with id {receiptid} has been updated.")
    
    

#Get all receipts for a user and its content
#Optional query parameters to filter by date, type, category, etc
@api_view(["GET"])
def getReceiptsByUser(request, userid):

    # Pull receipts associated with only these categories.
    categories = request.query_params.get('categories')

    # Pull only income or only expense or both types of receipts.
    types = request.query_params.get('types')

    # Pull receipts with a date no earlier than ...
    start_date = request.query_params.get('start_date')

    # Pull receipts with a date no later than ...
    end_date = request.query_params.get('end_date')

    # Pull only this number of receipts
    numRecords = request.query_params.get('numRecords')

    # Minimum Total Amount
    minAmount = request.query_params.get('minAmount')

    # Maximum Total Amount
    maxAmount = request.query_params.get('maxAmount')

    user = Users.objects.get(user_id = userid)

    allReceipts = Receipt.objects.filter(user = user).order_by('-pk')[:10][::-1]

    incomeReceipts = Income.objects.select_related('receipt').filter(receipt__user = user)
    
    expenseReceipts = Expense.objects.select_related('receipt').filter(receipt__user = user)        
    out = []
    for rec in allReceipts:
        object = {'incomes': incomeReceipts.filter(receipt__receipt_id = rec.receipt_id).values(),
                    'expenses': expenseReceipts.filter(receipt__receipt_id = rec.receipt_id).values()}
        object['receipt'] = Receipt.objects.filter(receipt_id = rec.receipt_id).values()[0]
        object['receipt_id'] = rec.receipt_id
        out.append(object)

    return Response(out)

#Create a new receipt:
#Internally, this means that we are creating one entry in the Receipts table along with one or more records in the 
#Incomes and/or Expenses table (depending on the type of receipt provided in the body.)
@api_view(["POST"])
def postReceipt(request):
    #print(request.data)
    is_income = bool(request.data['receipt']['receipt_is_income'])
    serializer = None
    if is_income:
        serializer = IncomeReceiptSerializer(data=request.data,
                                        context={'request': request})
    else:
        serializer = ExpenseReceiptSerializer(data=request.data,
                                        context={'request': request})

    serializer.is_valid(raise_exception=True)
    receiptPackage = serializer.validated_data
    userid = request.data['userid']
    user = Users.objects.get(user_id = userid)

    #1. Create the receipt object
    recData = receiptPackage['receipt']
    #1. Create the receipt object
    receipt = Receipt.objects.create(**recData,
    user = user)

    #2. Create the corresponding expense and/or income objects
    if is_income:
        for income in receiptPackage['incomes']:
            Income.objects.create(**income,
            receipt = receipt
         )
    else:
        for expense in receiptPackage['expenses']:
            Expense.objects.create(**expense,
            receipt = receipt)   
    
    return Response({
        'receipt_id': receipt.receipt_id
    })

#Create a new receipt:
#This API is intended to be used by quick receipt uploads with only a total quantity and no individual items
@api_view(["POST"])
def postSimpleReceipt(request):
    serializer = SimpleReceiptSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    recDat = serializer.validated_data
    receipt = Receipt.objects.create(user_id = recDat['user_id'],
    receipt_name = recDat['receipt_name'],
    receipt_date = recDat['receipt_date'], 
    receipt_is_reccuring = recDat['reccuring'],
    receipt_is_income = recDat['is_income'])

    if recDat['is_income']:
        Income.objects.create(
            income_name = recDat['receipt_name'],
            income_amount = recDat['receipt_amount'],
            receipt = receipt,
            category_id = recDat['category']
        )
    else:
        Expense.objects.create(
            expense_name = recDat['receipt_name'],
            expense_price = recDat['receipt_amount'],
            receipt = receipt,
            category_id = recDat['category']
        )
    
    return Response({
        'receipt_id': receipt.receipt_id
    })