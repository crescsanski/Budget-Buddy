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

class ValidateChallengeViewSet(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ValidateChallengeSerializer
    
    @action(detail=False, methods=['post'])
    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
  
        serializer.is_valid(raise_exception=True)

        type = serializer.validated_data

        
        """ with connection.cursor() as cursor:
            cursor.callproc('validate_challenge', [type.user, type.challenge])
            result = cursor.fetchall() """
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT budgetBuddy.validate_challenge_{type.challenge}(${type.user});")
            result = cursor.fetchone()

        return Response(result)
