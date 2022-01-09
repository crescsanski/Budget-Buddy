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
import cv2
from PIL import Image
import re
import numpy as np
import shutil

class SecurityQuestionViewSet(viewsets.ModelViewSet):
    queryset = SecurityQuestion.objects.all()
    serializer_class = SecurityQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

class UsersViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    Additionally we also provide an extra `highlight` action.
    """
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def highlight(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = '__all__'

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = '__all__'

    @action(detail=False, methods=['GET'], name='Get Income')
    def income(self, request, format=None):
        queryset = Category.objects.filter(category_income = True)
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Get Spending')
    def spending(self, request, format=None):
         queryset = Category.objects.filter(category_income = False)
         serializer = CategorySerializer(queryset, many=True)
         return Response(serializer.data)

class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChallengeInventoryViewSet(viewsets.ModelViewSet):
    queryset = ChallengeInventory.objects.all()
    serializer_class = ChallengeInventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    # @action(detail=False, methods=['GET'], name='Get Completed Badges')
    # def earnedBadges(self, request, format=None):
    #      userId = self.kwargs.get(self.lookup_url_kwarg)
    #      print("UserID: ", userId)
    #      queryset = ChallengeInventory.objects.filter(challenge_completion = True, user = userId).prefetch_related('challenge')
    #      serializer = ChallengeInventorySerializer(queryset, many=True)
    #      return Response(serializer.data)

class CompetitionStatusViewSet(viewsets.ModelViewSet):
    queryset = CompetitionStatus.objects.all()
    serializer_class = CompetitionStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class CompetitionsViewSet(viewsets.ModelViewSet):
    queryset = Competitions.objects.all()
    serializer_class = CompetitionsSerializer
    permission_classes = [permissions.IsAuthenticated]

class DifficultyViewSet(viewsets.ModelViewSet):
    queryset = Difficulty.objects.all()
    serializer_class = DifficultySerializer
    permission_classes = [permissions.IsAuthenticated]

class FriendStatusViewSet(viewsets.ModelViewSet):
    queryset = FriendStatus.objects.all()
    serializer_class = FriendStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class FriendsViewSet(viewsets.ModelViewSet):
    queryset = Friends.objects.all()
    serializer_class = FriendsSerializer
    permission_classes = [permissions.IsAuthenticated]

class GlobalCompetitionsViewSet(viewsets.ModelViewSet):
    queryset = GlobalCompetitions.objects.all()
    serializer_class = GlobalCompetitionsSerializer
    permission_classes = [permissions.IsAuthenticated]

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ItemsViewSet(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer
    permission_classes = [permissions.IsAuthenticated]

class NotificationsViewSet(viewsets.ModelViewSet):
    queryset = Notifications.objects.all()
    serializer_class = NotificationsSerializer
    permission_classes = [permissions.IsAuthenticated]

class LevelsViewSet(viewsets.ModelViewSet):
    queryset = Levels.objects.all()
    serializer_class = LevelsSerializer
    permission_classes = [permissions.IsAuthenticated]

class BudgetGoalsViewSet(viewsets.ModelViewSet):
    queryset = UserBudgetGoal.objects.all()
    serializer_class = BudgetGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

class TriggerViewSet(viewsets.ModelViewSet):
    queryset = Trigger.objects.all()
    serializer_class = TriggerSerializer
    permission_classes = [permissions.IsAuthenticated]

class NotificationsListViewSet(viewsets.ModelViewSet):
    queryset = NotificationsList.objects.all()
    serializer_class = NotificationsListSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

class WidgetViewSet(viewsets.ModelViewSet):
    queryset = Widget.objects.all()
    serializer_class = WidgetSerializer
    permission_classes = [permissions.IsAuthenticated]

class WidgetInventoryViewSet(viewsets.ModelViewSet):
    queryset = WidgetInventory.objects.all()
    serializer_class = WidgetInventorySerializer
    permission_classes = [permissions.IsAuthenticated]


class RegisterView(GenericAPIView):

    permission_classes = (
    permissions.AllowAny,
     )

    @action(detail=False, methods=['post'])
    def post(self, request, *args, **kwargs):
        
        serializer = UserRegistrationSerializer(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        
        
        # First, let's check if the user name exists
        common = Users.objects.filter(username = user['username'])
        if len(common) > 0:
            raise Exception("A user with the given username already exists.  Please enter a different username.")
                
        # Otherwise, if all correct, we create the user
        auth.get_user_model().objects.create_user(username = user['username'], password=user['password'], extra=user)
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

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'birth_date': user.birth_date,
            'email': user.email,
            'phone_number': user.phone_number,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'registered': user.registered
        })
    
class Logout(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def post(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)

class ValidateChallengeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ValidateChallengeSerializer
    
    def create(self, request):

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

class ReceiptUploadConvertViewSet(viewsets.ViewSet):
    serializer_class = ReceiptUploadSerializer

    def create(self, request):
        file_uploaded = request.FILES.get('file_uploaded')
        filename = file_uploaded.name
        origPath = f"rawReceipts/{filename}"
        finalPaths = []
        fs = FileSystemStorage(location='rawReceipts')
        fs.save(filename, file_uploaded)
        content_type = file_uploaded.content_type
        response = "POST API and you have uploaded a {} file".format(content_type)
        if not(content_type.startswith('image') or content_type == 'application/pdf'):
            return Response("Invalid File Type.  Only PDF and image files are accepted.")
        elif content_type == 'application/pdf':
            #Convert the PDF into an Image
            pages = convert_from_path(pdf_path = origPath, dpi = 300)

            i = 0
            for page in pages:
                image_name = filename[:-4] + "_" + str(i) + ".jpg"
                path = f"rawReceipts/{image_name}"
                page.save(path, "JPEG")
                finalPaths.insert(i, path)
                i += 1
        else:
            finalPaths.insert(0, origPath)

        for path in finalPaths:

                image = cv2.imread(path)
             #   gray = self.get_grayscale(image)
             #   thresh = self.thresholding(gray)
                
              #  opening = self.opening(gray)
               # canny = self.canny(gray)

                #custom_config = r'--oem 3 --psm 6'
                #content = pytesseract.image_to_string(thresh, config=custom_config)

                content = pytesseract.image_to_string(image)
                amounts = self.get_amounts(content)
                grandTotal = max(amounts)
                splits = content.splitlines()
                vendorName = splits[0]
                dates = self.get_dates(content)
                print("Dates: ", dates)
                print("Vendor Name: ", vendorName)
                print("Amounts: ", amounts)
                print("Grand Total: ", grandTotal)
        
        #Delete the contents of the directory with the original image/PDF files
        shutil.rmtree('rawReceipts', True)

        return Response(response)

    # extract dates from receipt
    def get_dates(self, content):
        dateNameRegex = r'((\b\d{1,2}\D{0,3})?\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)\D?)(\d{1,2}(st|nd|rd|th)?)?((\s*[,.\-\/]\s*)\D?)?\s*((19[0-9]\d|20\d{2})|\d{2})*'
        tradDateRegex = r'^(?:(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])|(3[01]|[12][0-9]|0?[1-9])/(1[0-2]|0?[1-9]))/(?:[0-9]{2})?[0-9]{2}$'
        dates = (re.findall(dateNameRegex, content)) + (re.findall(tradDateRegex, content))
        unique = list(dict.fromkeys(dates))
        # Remove duplicate items in tuples
        
        datPol = list()
        for dit in unique:
            dat = set()
            datPol.append(dat)
            for j in dit:
                if re.search(r'^[\s,\-.:\\\/]*$', j) == None:
                    dat.add(j.strip())
                    
    
        return datPol

    
    # extract itemized and grand total amounts from receipt text
    def get_amounts(self, content):
        amounts = re.findall(r'\d+\.\d{2}\b', content)
        floats = [float(amount) for amount in amounts]
        unique = list(dict.fromkeys(floats))
        return unique
    
    # get grayscale image
    def get_grayscale(self, image):
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # noise removal
    def remove_noise(self, image):
        return cv2.medianBlur(image,5)
    
    #thresholding
    def thresholding(self, image):
        return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    #dilation
    def dilate(self, image):
        kernel = np.ones((5,5),np.uint8)
        return cv2.dilate(image, kernel, iterations = 1)
        
    #erosion
    def erode(self, image):
        kernel = np.ones((5,5),np.uint8)
        return cv2.erode(image, kernel, iterations = 1)

    #opening - erosion followed by dilation
    def opening(self, image):
        kernel = np.ones((5,5),np.uint8)
        return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

    #canny edge detection
    def canny(self, image):
        return cv2.Canny(image, 100, 200)

    #skew correction
    def deskew(self, image):
        coords = np.column_stack(np.where(image > 0))
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated

    #template matching
    def match_template(self, image, template):
        return cv2.matchTemplate(image, template, cv2.TM_CCOEFF_NORMED)


# Views for Database Views

class BadgesEarnedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BadgesEarned.objects.all()
    serializer_class = BadgesEarnedSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        queryset = BadgesEarned.objects.filter(user_id = pk)
        serializer = BadgesEarnedSerializer(queryset, many=True)
        return Response(serializer.data)

