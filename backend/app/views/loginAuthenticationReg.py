import datetime
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
from rest_framework.decorators import action, permission_classes, authentication_classes
from django.contrib.auth import get_user_model, logout
from rest_framework.response import Response
from django.forms.models import model_to_dict
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

class RegisterView(GenericAPIView):

    permission_classes = (
    permissions.AllowAny,
     )
     
    # don't check token for this view
    @authentication_classes([])
    @action(detail=False, methods=['post'])
    def post(self, request, *args, **kwargs):
        
        serializer = UserRegistrationSerializer(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        
        
        # First, let's check if the user name exists
        common = Users.objects.filter(user_user_name = user['user_user_name'])
        if len(common) > 0:
            raise Exception("A user with the given username already exists.  Please enter a different username.")
                
        # Otherwise, if all correct, we create the user
        # ensure, the is_active flag is set to true; otherwise, the user will be mistaken as invalid:
        user['is_active'] = True
        auth.get_user_model().objects.create_user(username = user['user_user_name'], password=user['password'], extra=user)
        return Response("User has been registered successfully!")


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
  
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Remove any old tokens for the user if they exist
        Token.objects.filter(user=user).delete()

        # Create a new token for the user
        token = Token.objects.create(user=user)

        # Update the user_last_login field
        Users.objects.filter(user_id = user.user_id).update(last_login = datetime.datetime.now(datetime.timezone.utc))

        return Response({
            'token': token.key,
            **model_to_dict(user)
        })
    
class Logout(GenericAPIView):

    #permission_classes = [permissions.IsAuthenticated]
 
    @action(detail=False, methods=['post'])
    def post(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)