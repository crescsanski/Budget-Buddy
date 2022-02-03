from datetime import datetime
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
from django.utils import timezone
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
#This API is intended for setting, modifying, and deleting a user's budget.

#The function below handles the initial creation of a user's budget.  It expects a list of monthly estimated incomes and expenses, as well
#as an actual target budget value set for each income and expense category.
@api_view(["POST"])
def setInitialBudget(request):
    serializer = InitialBudgetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = None
    try:
        user = request.data['user_id']
    except:
        raise ValidationError("A valid userID must be provided in the body.")
    if Users.objects.filter(user_id = user).count() == 0:
        raise ValidationError("A user with the given ID does not exist.")
    
    validData = serializer.validated_data

    if len(validData['budgets']) < Category.objects.count():
        raise ValidationError("Please provide budget data for each category.")

    #Next, we need to delete any existing user_budget records
    UserCategoryBudget.objects.filter(user_id=user).delete()
    
    try:
        for budget in validData['budgets']:
            UserCategoryBudget.objects.create(**budget, user_id=user, user_category_budget_last_modified_date = timezone.now())
    except:
        raise ValidationError("The user already has an existing budget.")

    return Response(f"An initial budget has been set for user_id {user}")

@api_view(["GET"])
#Retrieve budgets for a specified user
def manageUserBudget(request, userid):
    if Users.objects.filter(user_id = userid).count() == 0:
        raise ValidationError("A user with the given ID does not exist.")
    budgets = UserCategoryBudget.objects.filter(user_id = userid).values()
    return Response(budgets)