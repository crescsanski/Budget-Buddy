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
from django.db.models import F
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from app.serializers import *
from django.contrib import auth
from pdf2image import convert_from_path
from django.db import connection
from django.core.files.storage import FileSystemStorage
from django.db.models.functions import Cast
from django.db.models import FloatField
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

def retrieveUserLevelData(user_id):
    user = Users.objects.filter(user_id = user_id)
    send = user.annotate(level = F('user_level'),
                experience_points = F('user_current_experience_points'),
                required_experience = F('user_required_experience_points')).values('level', 'experience_points',
                    'required_experience')
    return send

@api_view(['GET'])
def manageUserChallInv(request, user_id):
    user = Users.objects.get(user_id = user_id)

    ex = UserChallengeInventory.objects.filter(user = user).select_related('challenge').annotate(
        id = 
    F('user_challenge_inventory_id'),
                name = F('challenge__challenge_name'),
                no_badge = F('challenge__challenge_is_repeatable'),
                description = F('challenge__challenge_description'),
                rewardPoints = F('challenge__challenge_experience_points'),
                start_date = F('user_challenge_start_date'),
                is_active = F('challenge__challenge_is_active'),
                goal = F('challenge__challenge_completion_amount'),
                progress = F('user_challenge_current_amount'),
                completion_date = F('user_challenge_completion_date'),
                type = F('challenge__challenge_type'),
                time_given = F('challenge__challenge_time_given'),
                trigger = F('challenge__challenge_trigger')).annotate(
                    fracCompl = Cast(F('progress'), FloatField()) / Cast(F('goal'), FloatField()) * 100).values(
                    'id', 'name', 'description', 'rewardPoints', 'start_date', 'is_active', 'no_badge', 'goal', 'progress', 'fracCompl', 'completion_date', 'type', 'time_given', 'trigger'
                )
    
    levelData = retrieveUserLevelData(user_id)[0]
    out = {
        'inventory': ex,
        'levelProgress': levelData
    }

    return Response(out)
    

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
