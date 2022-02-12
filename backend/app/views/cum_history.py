import copy
from sre_constants import CATEGORY_UNI_DIGIT

import pytz
from app.models import *
from django.db.models import *
from django.utils import timezone
from django.db.models.functions import *
import datetime
from app.serializers import *
from django.core import serializers
from rest_framework.decorators import api_view
import json
from rest_framework.response import Response
from app.views.income_history import incomeHistoryInternal
from app.views.spend_history import getSpentHistoryInternal
from app.views.savings_history import getSavingsHistoryInternal

@api_view(['GET'])
def getCumSavHistory(request, user_id):
    origParams = request.GET
    
    startCumParams = {}
    startCumParams['end_date'] = origParams.get('start_date')
    startCumParams['start_date'] = None 

    startCumAmount = []
    if origParams.get('start_date') is not None:
        startCumAmount = getSavingsHistoryInternal(startCumParams, user_id)
    
    netAmounts = getSavingsHistoryInternal(origParams, user_id)

    if len(startCumAmount) > 0 and len(netAmounts) > 0:
        netAmounts[0]['totalSavings'] += startCumAmount[0]['totalSavings']

    if len(netAmounts) > 0:
        for i in range(1, len(netAmounts)):
            if len(startCumAmount) > 0:
                netAmounts[i]['totalSavings'] += startCumAmount[0]['totalSavings'] 
            else:
                netAmounts[i]['totalSavings'] += netAmounts[i - 1]['totalSavings']  

    return Response(netAmounts)

@api_view(['GET'])
def getCumSpendOrIncomeHistory(request, user_id, category_id = None, type = 'totalSpent'):

    origParams = request.GET
    
    startCumParams = {}
    startCumParams['end_date'] = origParams.get('start_date')
    startCumParams['category_breakdown'] = origParams.get('category_breakdown')
    startCumParams['start_date'] = None

    args1 = {'params': startCumParams, 'user_id': user_id, 'category_id': category_id}
    args2 = {'params': origParams, 'user_id': user_id, 'category_id': category_id}

    startCumAmount = []
    if origParams.get('start_date') is not None:
        if type == 'totalSpent':
            startCumAmount = getSpentHistoryInternal(**args1)
        else:
           startCumAmount = incomeHistoryInternal(**args1) 
    
    if type == 'totalSpent':
        netAmounts = getSpentHistoryInternal(**args2)
    else:
        netAmounts = incomeHistoryInternal(**args2)
    
    
    if len(startCumAmount) > 0 and len(netAmounts) > 0:
        curCat = startCumAmount[0].get('category_id')
        curCatIndex = 0
        netAmounts[0][type] += startCumAmount[0][type]
    
    if len(netAmounts) > 0:
        for i in range(1, len(netAmounts)):
            if len(startCumAmount) > 0 and netAmounts[i].get('category_id') != curCat:
                curCat = netAmounts[i].get('category_id')
                curCatIndex += 1
                netAmounts[i][type] += startCumAmount[curCatIndex][type] 
            else:
                netAmounts[i][type] += netAmounts[i - 1][type]  

    return Response(netAmounts)

