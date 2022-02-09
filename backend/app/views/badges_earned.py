from PIL.Image import Image
from django.contrib.auth import password_validation
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from django.db.models import F
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

class BadgesEarnedViewSet(GenericAPIView):
    #permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return None

    @action(detail=False, methods=['get'])
    def get(self, request, *args, **kwargs):

        userid = self.kwargs['userid']
   
        user = Users.objects.get(user_id = userid)

        chFields = ['challenge__' + c.name for c in Challenge._meta.get_fields()]
        ciFields = [ci.name for ci in UserChallengeInventory._meta.get_fields()]
        desiredFields = chFields + ciFields

        ex = UserChallengeInventory.objects.filter(user = user).select_related(
            'challenge').annotate(badge_id = F('challenge__userchallengeinventory'),
                    badge_name = F('challenge__challenge_name'),
                    badge_description = F('challenge__challenge_description')).values(
                        'badge_id', 'badge_name', 'badge_description'
                    )

        return Response(ex)