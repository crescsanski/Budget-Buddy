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


@api_view(['GET'])
def getCumHistory(request, user_id, category_id = None, type = 'totalSpent'):

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
            startCumAmount = getSpentHistoryInternal(params = startCumParams, user_id = user_id, category_id = category_id)
        else:
           startCumAmount = incomeHistoryInternal(params = startCumParams, user_id = user_id, category_id = category_id) 
    
    if type == 'totalSpent':
        netAmounts = getSpentHistoryInternal(params = origParams, user_id = user_id, category_id = category_id)
    else:
        netAmounts = incomeHistoryInternal(params = origParams, user_id = user_id, category_id = category_id)
    
    
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

