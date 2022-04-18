from collections import namedtuple
import fnmatch
import json
import dateutil
from PIL.Image import Image
from django.contrib.auth import password_validation
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
import os
from skimage.filters import threshold_local
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
from rest_framework.decorators import api_view, throttle_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from difflib import get_close_matches
import dateutil.parser
from app.views.receipt_parse import ParseReceipt

class ReceiptUploadConvertViewSet(GenericAPIView):
    serializer_class = ReceiptUploadSerializer
    parser_classes = [MultiPartParser, FormParser]
   
    def post(self, request, format=None):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        package = serializer.validated_data
        out = {}
        for f in package['files']:
            out[f.name] = self.processFile(file_uploaded = f)

        shutil.rmtree('rawReceipts/', True)
        shutil.rmtree('images/', True)

        return Response(out)

    def processFile(self, file_uploaded):
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

        for idx, path in enumerate(finalPaths):
            orig = cv2.imread(path)
    
            if physical:
                receipt = self.cropReceipt(input = orig)
             
                if receipt is not None:
                    areOr = orig.shape[0] * orig.shape[1]
                    areNew = receipt.shape[0] * receipt.shape[1]
                    if areNew >= 0.2 * areOr:
                        enhanceCrop = self.remove_noise_and_smooth(receipt)
                        cv2.imwrite(self.getSavePath(f'enhanceCrop-{idx}.jpg'), enhanceCrop)

                try:
                    data = self.runOCR(enhanceCrop, "--psm 6")
                    
                except:
                    try:
                        regEnhance = self.remove_noise_and_smooth(orig)
                        cv2.imwrite(self.getSavePath(f"regEnhance-{idx}.jpg"), regEnhance)
                        data = self.runOCR(regEnhance, "--psm 6")
                    except:
                        try:
                            data = self.runOCR(orig, "--psm 6")
                        except:
                            raise Exception("The receipt API failed to parse the receipt.  Please try retaking the photo.")
            else:
                data = self.runOCR(input)
                cv2.imwrite(self.getSavePath(f"digitallyRendered-{idx}.jpg"), input)
        
                
        
        # #Delete the contents of the directory with the original image/PDF files
        # shutil.rmtree('rawReceipts/', True)

        # #Create a receipt object with the parsed data, but DO NOT SAVE to the database.
        # data = {}
        # data['receipt'] = {
        #     'receipt_date': dates.pop() if len(dates) > 0 else None,
        #      'receipt_name': vendorName
        # }
        # itemArray = []
        # for idx, item in enumerate(itemizedLines):
        #     ex = {'expense_name': itemNames[idx],
        #                 'expense_price': amounts[idx],
        #     }
        #     itemArray.append(ex)
        # data['expenses'] = itemArray
    
        return data
    
    def getSavePath(self, filename):
        if not os.path.exists(os.path.join(os.getcwd(), 'images')):
            os.mkdir(os.path.join(os.getcwd(), 'images'))
        return os.path.join(os.getcwd(), 'images', filename)
    
    

    
    def runOCR(self, receipt, options = None):
        #bw = cv2.cvtColor(receipt, cv2.COLOR_BGR2RGB)
        #ret, imgf = cv2.threshold(receipt, 0, 255,cv2.THRESH_BINARY,cv2.THRESH_OTSU)
        # cv2.imwrite(f"thresholded.jpg", ret)
        content = pytesseract.image_to_string(receipt, config=options)
        #print(content)
        #print(content)
        if len(content) < 3:
            raise Exception("The uploaded file doesn't contain any text.")
       
        data = ParseReceipt(raw = content).to_dict()
        #print(data)
        return data
    
    #Here, we perform the 3 main 
    def enhanceImage(self, input):
        pass

    def remove_noise_and_smooth(self, img):
        
        #img = self.get_grayscale(img)   
        #img = self.thresholding(img)
        img = self.bw_scanner(img)
 
        #img = self.deskew(img)
        return img
            # img = img.astype(np.uint8)
            # filtered = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 41)
            # kernel = np.ones((1, 1), np.uint8)
            # opening = cv2.morphologyEx(filtered, cv2.MORPH_OPEN, kernel)
            # closing = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel)
            # img = self.image_smoothening(img)
            # or_image = cv2.bitwise_or(img, closing)
            # return or_image
    
    def image_smoothening(self, img):
        ret1, th1 = cv2.threshold(img, 180, 255, cv2.THRESH_BINARY)
        ret2, th2 = cv2.threshold(th1, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        blur = cv2.GaussianBlur(th2, (1, 1), 0)
        ret3, th3 = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return th3

    def opencv_resize(self, image, ratio):
        width = int(image.shape[1] * ratio)
        height = int(image.shape[0] * ratio)
        dim = (width, height)
        return cv2.resize(image, dim, interpolation = cv2.INTER_AREA)

    
    def cropReceipt(self, input):
        
        image = input.copy()

        #downscale image because finding receipt contour is more efficient on small image
        # image = imutils.resize(image, width=500)
        # area = image.shape[0] * image.shape[1]
        # ratio = input.shape[1] / float(image.shape[1])
        resize_ratio = 500 / image.shape[0]
        original = image.copy()
        image = self.opencv_resize(image, resize_ratio)

        #convert to grayscale to make it easier to distinguish the background from the foreground
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        cv2.imwrite(self.getSavePath(f"gray.png"), gray)
  
        #Get rid of noise with a blur filter
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        cv2.imwrite(self.getSavePath(f"blurred.png"), blurred)

        #Detect white regions 
        rectKernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9,9))
        dilated = cv2.dilate(blurred, rectKernel)
        cv2.imwrite(self.getSavePath(f"dilated.png"), dilated)
 
        edged = cv2.Canny(dilated, 100, 200, apertureSize=3)
        cv2.imwrite(self.getSavePath(f"edged.png"), edged)

      
        #Detect contours in the edged image and process them
        cnts, hierarchy = cv2.findContours(edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        #cnts = imutils.grab_contours(cnts)
        #Grab the 10 largest contours
        largest_cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:10]

        try:
            receipt_contour = self.get_receipt_contour(largest_cnts)
            #With the receipt contour found, let's apply our perspective transform to the image
            # apply a four-point perspective transform to the *original* image to
            # obtain a top-down bird's-eye view of the receipt
            #receipt = four_point_transform(input, receiptCnt.reshape(4, 2) * ratio)

            scanned = self.wrap_perspective(original.copy(), self.contour_to_rect(receipt_contour, resize_ratio))
            cv2.imwrite(self.getSavePath(f'perspectiveVersion.png'), scanned)
            #cv2.imwrite('savedImage.png', final)
            return scanned
        except:
            return None     

    def get_receipt_contour(self, cnts):
        #Determine if the contour contains four vertices
        # initialize a contour that corresponds to the receipt outline
        receiptCnt = None
        # loop over the contours
        for c in cnts:
            # approximate the contour
            #peri = cv2.arcLength(c, True)
            #approx = cv2.approxPolyDP(c, 0.02 * peri, True)
            approx = self.approximate_contour(c)                
            # if our approximated contour has four points, then we can
            # assume we have found the outline of the receipt
            if len(approx) == 4:
                receiptCnt = approx
                return approx
                #break
        # if the receipt contour is empty then our script could not find the
        # outline and we should be notified
        if receiptCnt is None:
            raise Exception(("Could not find receipt outline. "
                "Try debugging your edge detection and contour steps."))

    # approximate the contour by a more primitive polygon shape
    def approximate_contour(self, contour):
        peri = cv2.arcLength(contour, True)
        return cv2.approxPolyDP(contour, 0.032 * peri, True)
    
    def bw_scanner(self, image):
        threshold = 5
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        #T = threshold_local(gray, 11, offset = 5, method = "gaussian")
        #return (gray > T).astype("uint8") * 255
         # Original image size
        orignrows, origncols = gray.shape
        
        # Windows size
        M = int(np.floor(orignrows/16) + 1)
        N = int(np.floor(origncols/16) + 1)
        
        # Image border padding related to windows size
        Mextend = round(M/2)-1
        Nextend = round(N/2)-1
        
        # Padding image
        aux =cv2.copyMakeBorder(gray, top=Mextend, bottom=Mextend, left=Nextend,
                            right=Nextend, borderType=cv2.BORDER_REFLECT)
        
        windows = np.zeros((M,N),np.int32)
        
        # Image integral calculation
        imageIntegral = cv2.integral(aux, windows,-1)
        
        # Integral image size
        nrows, ncols = imageIntegral.shape
        
        # Memory allocation for cumulative region image
        result = np.zeros((orignrows, origncols))
        
        # Image cumulative pixels in windows size calculation
        for i in range(nrows-M):
            for j in range(ncols-N):
            
                result[i, j] = imageIntegral[i+M, j+N] - imageIntegral[i, j+N]+ imageIntegral[i, j] - imageIntegral[i+M,j]
        
        # Output binary image memory allocation    
        binar = np.ones((orignrows, origncols), dtype=np.bool)
        
        # Gray image weighted by windows size
        graymult = (gray).astype('float64')*M*N
        
        # Output image binarization
        binar[graymult <= result*(100.0 - threshold)/100.0] = False
        
        # binary image to UINT8 conversion
        binar = (255*binar).astype(np.uint8)
        
        return binar
    
    def contour_to_rect(self, contour, resize_ratio):
        pts = contour.reshape(4, 2)
        rect = np.zeros((4, 2), dtype = "float32")
        # top-left point has the smallest sum
        # bottom-right has the largest sum
        s = pts.sum(axis = 1)
        rect[0] = pts[np.argmin(s)]
        rect[2] = pts[np.argmax(s)]
        # compute the difference between the points:
        # the top-right will have the minumum difference 
        # the bottom-left will have the maximum difference
        diff = np.diff(pts, axis = 1)
        rect[1] = pts[np.argmin(diff)]
        rect[3] = pts[np.argmax(diff)]
        return rect / resize_ratio
    
    def wrap_perspective(self, img, rect):
        # unpack rectangle points: top left, top right, bottom right, bottom left
        (tl, tr, br, bl) = rect
        # compute the width of the new image
        widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
        widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
        # compute the height of the new image
        heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
        heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
        # take the maximum of the width and height values to reach
        # our final dimensions
        maxWidth = max(int(widthA), int(widthB))
        maxHeight = max(int(heightA), int(heightB))
        # destination points which will be used to map the screen to a "scanned" view
        dst = np.array([
            [0, 0],
            [maxWidth - 1, 0],
            [maxWidth - 1, maxHeight - 1],
            [0, maxHeight - 1]], dtype = "float32")
        # calculate the perspective transform matrix
        M = cv2.getPerspectiveTransform(rect, dst)
        # warp the perspective to grab the screen
        return cv2.warpPerspective(img, M, (maxWidth, maxHeight))
        
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