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

#This API will be used primarily on the dashboard and budget page to display a summary of how much a user has spent in a given 
# time period for all categories or individual ones. 

#Given the similarity between routes, both will share the same view.  The only difference is that the route that specifies a 
#category_id will not have the "category_breakdown" query parameter option because it wouldn't make sense.  Obviously, there's 
#no way to break down spending history by category if only one category is selected.

#Get spending history for a user.
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
	# category_breakdown=true
        # (indicates whether or not to group totals by category)
@api_view(['GET'])
def getSpendHistory(request, user_id, category_id = None):
    expenses = getSpentHistoryInternal(request.GET, user_id, category_id)
    return Response(expenses)


def getSpentHistoryInternal(params, user_id, category_id = None):
    if not category_id:
        byCat = params.get('category_breakdown')

    start_date = params.get('start_date')
    end_date = params.get('end_date')
    yearVal = params.get('year')
    monthVal = params.get('month')
    weekVal = params.get('week')
    period = params.get('period')



    if not category_id and (byCat is not None and json.loads(byCat.lower())):
        firstValues = ['category_id']
        secondValues = ['category_id', 'totalSpent']
    else:
        firstValues = ['receipt__user_id']
        secondValues = ['totalSpent']

    if period in ['yearly', 'monthly', 'weekly']:
        firstValues.append('year')
        secondValues.append('year')

    if period in ['monthly', 'weekly']:
        firstValues.append('month')
        secondValues.append('month')

    if period in ['weekly']:
        firstValues.append('week')
        secondValues.append('week')

    filters = {
        'receipt__user_id': user_id
    }
    if category_id:
        filters['category_id'] = category_id
    
    future = timezone.now() + datetime.timedelta(days=1)
    futureString = future.isoformat()
    dawnString = datetime.datetime(1, 1, 1, 0, 0, 0, 0, tzinfo=pytz.UTC).isoformat()
    if start_date and end_date:
        filters['receipt__receipt_date__range'] = [start_date, end_date]
    elif start_date:
        filters['receipt__receipt_date__range'] = [start_date, futureString]
    elif end_date:
        filters['receipt__receipt_date__range'] = [dawnString, end_date]
    
    if yearVal:
        filters['year'] = yearVal

    if monthVal:
        filters['month'] = monthVal
    
    if weekVal:
        filters['week'] = weekVal


    data = Expense.objects.select_related('receipt'
            ).annotate(year=ExtractYear('receipt__receipt_date'),
                      month=ExtractMonth('receipt__receipt_date'),
                      week=ExtractWeek('receipt__receipt_date')
            ).filter(**filters
        ).values(*firstValues
        ).annotate(totalSpent=Sum('expense_price'))

    out = data.values(*secondValues).order_by(*firstValues)

    # data = Expense.objects.select_related('receipt'
    #         ).annotate(year=ExtractYear('receipt__receipt_date'),
    #                 month=ExtractMonth('receipt__receipt_date'),
    #                 week=ExtractWeek('receipt__receipt_date')
    #         ).filter(receipt__user_id = user_id,
    #                 receipt__receipt_date__range=[start_date, end_date],
    #                 year='2016' ,
    #                 month='8',
    #                 week='31'
    #     ).values('category_id', 'year', 'month', 'week'
    #     ).annotate(totalSpent=Sum('expense_price'))

    # out = data.values('category_id', 'totalSpent', 'year', 
    # 'month', 'week').order_by(
    #     'category_id', 'year', 'month', 'week')

    return out
    
#Get spending history for a user for a specific category.
#It should take the optional query parameters:
    # start_date=2012-02-01T14:48:00.000Z
    # end_date=2022-02-28T14:48:00.000Z
    # year=2016
 	# month=8
    # week=31
	# period=weekly


