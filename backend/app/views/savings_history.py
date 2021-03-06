from sre_constants import CATEGORY_UNI_DIGIT
from app.models import *
from django.db.models import *
import itertools
from django.db.models.functions import *
import pandas as pd
import datetime
from app.serializers import *
from django.core import serializers
from rest_framework.decorators import api_view
import json
from rest_framework.response import Response
from app.views.income_history import incomeHistoryInternal
from app.views.spend_history import getSpentHistoryInternal

#This API will be used primarily on the dashboard and budget page to display a summary of how much savings a user has accumulated in a given 
# time period.  Total savings is a calculation of income - expenses.


#Get savings history for a user.
#It should take the optional query parameters:
    # start_date=2012-02-01T14:48:00.000Z
        # (Given as a timestamp)
    # end_date=2022-02-28T14:48:00.000Z
        # (Given as a timestamp)
    # year=2016
 	# month=8
    # week=31
	# period=weekly
        # (Allow values as 'weekly', 'monthly', 'yearly', or 'daily')

@api_view(['GET'])
def getSavingsHistory(request, user_id):
    savings = getSavingsHistoryInternal(params = request.GET, user_id = user_id)
    return Response(savings)

def getSavingsHistoryInternal(params, user_id):

    period = params.get('period')

    expenseTable = getSpentHistoryInternal(params = params, user_id = user_id)
    incomeTable = incomeHistoryInternal(params = params, user_id = user_id)

    id = []
    if period in ['yearly', 'monthly', 'weekly']:
        id.append('year')
    if period in ['monthly', 'weekly']:
        id.append('month')
    if period in ['weekly']:
        id.append('week')

    if len(id) > 0 and not(len(incomeTable) == 0 and len(expenseTable) == 0):
        if len(incomeTable) > 0:
            incomeDf = pd.DataFrame(incomeTable).set_index(id)
        if len(expenseTable) > 0:
            expenseDf = pd.DataFrame(expenseTable).set_index(id)
        if len(incomeTable) > 0 and len(expenseTable) > 0:
            savingsDf = incomeDf.merge(expenseDf, how = 'outer', 
            left_index = True, right_index = True)
            savingsDf = savingsDf.fillna(0)
            savingsDf["totalSavings"] = savingsDf["totalIncomeReceived"] - savingsDf["totalSpent"]
            savingsDf = savingsDf.drop(columns = ['totalIncomeReceived', 'totalSpent'])
            savingsDf.reset_index(inplace = True)
            out = savingsDf.to_dict('records')
        elif len(incomeTable) > 0:
            incomeDf["totalSavings"] = incomeDf["totalIncomeReceived"]
            incomeDf = incomeDf.drop(columns = ['totalIncomeReceived'])
            incomeDf.reset_index(inplace = True)
            out = incomeDf.to_dict('records')
        else:
            expenseDf["totalSavings"] = -1 * expenseDf["totalSpent"]
            expenseDf = expenseDf.drop(columns = ['totalSpent'])
            expenseDf.reset_index(inplace = True)
            out = expenseDf.to_dict('records')
    elif len(incomeTable) == 1 and len(expenseTable) == 1:
        out = [{"totalSavings": incomeTable[0]['totalIncomeReceived'] - expenseTable[0]['totalSpent']}]
    elif len(incomeTable) == 1:
        out = [{"totalSavings": incomeTable[0]['totalIncomeReceived']}]
    elif len(expenseTable) == 1:
        out = [{"totalSavings": -1 * incomeTable[0]['totalSpent']}]
    else:
        out = [{"totalSavings": 0}]

    return out


