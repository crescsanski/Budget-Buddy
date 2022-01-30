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

    allReceipts = Receipt.objects.filter(user = user)

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
        common = Users.objects.filter(user_user_name = user['user_user_name'])
        if len(common) > 0:
            raise Exception("A user with the given username already exists.  Please enter a different username.")
                
        # Otherwise, if all correct, we create the user
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

class ReceiptUploadConvertViewSet(GenericAPIView):
    serializer_class = ReceiptUploadSerializer

    @action(detail=False, methods=['post'])
    def post(self, request, format=None):
        file_uploaded = request.FILES.get('file_uploaded')
        filename = file_uploaded.name
        physical = True #used to indicate whether the uploaded file is of a physical printed receipt or digital version
        metaData = False #used to indicate whether uploaded file contains info about it's origin (ex: the device from which it was taken)
        origPath = f"rawReceipts/{filename}"
        finalPaths = []
        fs = FileSystemStorage(location='rawReceipts')
        fs.save(filename, file_uploaded)
        content_type = file_uploaded.content_type
        response = "POST API and you have uploaded a {} file".format(content_type)
        if not(content_type.startswith('image') or content_type == 'application/pdf'):
            return Response("Invalid File Type.  Only PDF and image files are accepted.")
        elif content_type == 'application/pdf':
            #Detect whether PDF is a scanned image or digitally rendered
            text_perc = self.get_text_percentage(origPath)
            if text_perc < 0.01:
                physical = True
            else:
                physical = False
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
            img = Image.open(origPath)
            exifdata = img.getexif()
            if exifdata:
                metaData = True

        for path in finalPaths:

                orig = cv2.imread(path)
                if physical:
                    image = orig.copy()
                    image = imutils.resize(image, width=500)
                    area = image.shape[0] * image.shape[1]
                    ratio = orig.shape[1] / float(image.shape[1])
                    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                    blurred = cv2.GaussianBlur(gray, (5, 5,), 0)
                    edged = cv2.Canny(blurred, 75, 200)

                    #Detect contours in the edged image and process them
                    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                    cnts = imutils.grab_contours(cnts)
                    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

                    #Determine if the contour contains four vertices
                    # initialize a contour that corresponds to the receipt outline
                    receiptCnt = None
                    # loop over the contours
                    for c in cnts:
                        # approximate the contour
                        peri = cv2.arcLength(c, True)
                        
                        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
                                           
                        # if our approximated contour has four points, then we can
                        # assume we have found the outline of the receipt
                        # if the size of our contours is too small, then we also exit the loop
                        if cv2.contourArea(approx) / area < 0.4:
                            break
                        elif len(approx) == 4:
                            receiptCnt = approx
                            break
                    # if the receipt contour is empty then our script could not find the
                    # outline and we should be notified
                    if receiptCnt is None:
                        raise Exception(("Could not find receipt outline. "
                            "Try debugging your edge detection and contour steps."))

                    #With the receipt contour found, let's apply our perspective transform to the image
                    # apply a four-point perspective transform to the *original* image to
                    # obtain a top-down bird's-eye view of the receipt
                    receipt = four_point_transform(orig, receiptCnt.reshape(4, 2) * ratio)
                    cv2.imwrite('savedImage.jpg', receipt)
                else:
                    receipt = orig

                content = pytesseract.image_to_string(receipt)
                if len(content) > 2:
                    amounts = self.get_amounts(content)
                    itemizedLines = self.get_items(content)
                    itemNames = self.get_itemName(itemizedLines)
                    print("[INFO] price line items:")
                    print("========================")
                    print(itemizedLines)
                    print("ITEM Names")
                    print(itemNames)
                    grandTotal = None
                    if len(amounts) > 0:
                        grandTotal = max(amounts)
                    else:
                        grandTotal = "Not Found"
                    splits = content.splitlines()
                    vendorName = splits[0]
                    dates = self.get_dates(content)
                    print("Dates: ", dates)
                    print("Vendor Name: ", vendorName)
                    print("Amounts: ", amounts)
                    print("Grand Total: ", grandTotal)
                else: 
                    print("The uploaded file doesn't contain any text.")
        
        #Delete the contents of the directory with the original image/PDF files
        shutil.rmtree('rawReceipts', True)

        return Response(response)

        
    def get_text_percentage(self, file_name: str) -> float:
        """
        Calculate the percentage of document that is covered by (searchable) text.

        If the returned percentage of text is very low, the document is
        most likely a scanned PDF
        """
        total_page_area = 0.0
        total_text_area = 0.0

        doc = fitz.open(file_name)

        for page_num, page in enumerate(doc):
            total_page_area = total_page_area + abs(page.rect)
            text_area = 0.0
            for b in page.getTextBlocks():
                r = fitz.Rect(b[:4])  # rectangle where block text appears
                text_area = text_area + abs(r)
            total_text_area = total_text_area + text_area
        doc.close()
        return total_text_area / total_page_area


    # extract lines with itemized details
    def get_items(self, content):
        pricePattern = r'([0-9]+\.[0-9]+)'
        doNotMatch = ['total', 'sub', 'tip', 'change']
        items = []
        for row in content.splitlines():
            if re.search(pricePattern, row) is not None:
                for index, item in enumerate(doNotMatch):
                    if item in row.lower():
                        break
                    elif index == len(doNotMatch) - 1:
                        items.append(row)
        return items

    #Get names of items
    def get_itemName(self, items):
        namePattern = r'^[a-zA-Z\s-]$'
        names = []
        for item in items:
            nameChoices = self.findall_overlapping(namePattern, item)
            names.append(nameChoices)
        return names


    # extract dates from receipt
    def get_dates(self, content):
        monDDYYYY = r'((\b\d{1,2}\D{0,3})?\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)\D?)(\d{1,2}(st|nd|rd|th)?)?((\s*[,.\-\/]\s*)\D?)?\s*((19[0-9]\d|20\d{2})|\d{2})*'
        monthName = r'^(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)$'
        YYYY = r'(19[0-9]\d|20\d{2})'
        MM = r'(0[1-9]|1[0-2])'
        DD = r'(0[1-9]|[12][0-9]|3[01])'
        sep = r'[\-.\/:,]'
        DDMMYYYY = DD + sep + MM + sep + YYYY
        YYYYMMDD = YYYY + sep + MM + DD
        MMDDYYYY = MM + sep + DD + sep + YYYY
        monDDYYYY = monthName + sep + DD + r', ' + YYYY
        DDMonYYYY = DD + sep + monthName + r', ' + YYYY
        YYYYMonDD = YYYY + r', ' + monthName + sep + DD
        master = '|'.join([monDDYYYY, MMDDYYYY, DDMMYYYY, YYYYMMDD, YYYYMonDD])
        dates = self.findall_overlapping(master, content) 
        #unique = list(dict.fromkeys(dates))
        # Remove duplicate items in tuples
        datPol = set()
        for dit in dates:
            datPol.add(dit.group())                    
    
        return datPol
    
    def findall_overlapping(self, pattern, string, flags=0):
        """Find all matches, even ones that overlap."""
        regex = re.compile(pattern, flags)
        pos = 0
        while True:
            match = regex.search(string, pos)
            if not match:
                break
            yield match
            pos = match.start() + 1

    
    # extract itemized and grand total amounts from receipt text
    def get_amounts(self, content):
        amounts = re.findall(r'\d+\.\d{2}\b', content)
        floats = [float(amount) for amount in amounts]
        unique = list(dict.fromkeys(floats))
        return unique
    
    # get grayscale image
    def get_grayscale(self, image):
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    def get_gausblur(self, image):
        return cv2.GaussianBlur(image, (5, 5,), 0)

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

        ex = UserChallengeInventory.objects.filter(user = user).select_related('challenge').values(
            *desiredFields
        )



        return Response(ex)

