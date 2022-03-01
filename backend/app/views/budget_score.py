from datetime import timezone
import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dateutil.relativedelta import relativedelta
from app.views.income_history import incomeHistoryInternal
from app.views.spend_history import getSpentHistoryInternal
from app.models import *
from django.db.models.functions import *
from django.db.models import *

@api_view(["GET"])
#WANT SCORE VARIABLES
def budgetScore(request, user_id):
    sixMonths = datetime.datetime.now() - datetime.timedelta(days = 180)
    totalWants = getSpentHistoryInternal(params={'start_date':sixMonths,'category_type':'want'},user_id=user_id)
    totalIncome = incomeHistoryInternal(params={'start_date':sixMonths},user_id=user_id)
    totalWantsTwo = totalWants[0]['totalSpent'] if len(totalWants) > 0 else 0
    totalIncomeTwo = totalIncome[0]['totalIncomeReceived'] if len(totalIncome) > 0 else 0

   

# //want score variables (past 6 months only)
#         double totalWants = 30.00; //change me (min 0)
#         double totalIncome = 100.00; //change me
#         double wantScoreInput = ((totalWants/totalIncome) * 100);
#         double wantScore;
# //totalWants = 
# //SELECT SUM (expense_price)
# //FROM budgetbuddy.expense
# //INNER JOIN budgetbuddy.receipt ON budgetBuddy.expense.receipt_id = budgetBuddy.receipt.receipt_id
# //INNER JOIN budgetbuddy.category ON budgetBuddy.expense.category_id = budgetBuddy.category.category_id
# //WHERE budgetbuddy.receipt.user_id = 1
# //AND budgetbuddy.receipt.receipt_date >= (current_date - 180)
# //AND budgetbuddy.category.category_type = 'want';

# //totalIncome = 
# //same as above but with 'income' instead of want

#USE SCORE VARIABLES
    tempUserInfo = Users.objects.filter(pk=user_id).values('user_registration_date','user_total_logins')
    numberDaysInput = (datetime.datetime.today().date() - tempUserInfo[0]['user_registration_date'] + datetime.timedelta(days=1)).days
    totalLogins = tempUserInfo[0]['user_total_logins']
    numberDays = None
    if numberDaysInput > 180:
        numberDays = 180
    else:
        numberDays = numberDaysInput
    useScoreInput = ((totalLogins/numberDays) * 100)
    useScore = None
# //usage score variables (past 180 days only)
#         double totalLogins = 90; //change me (min 0, max <= numberDays)
#         double numberDaysInput = 180; //change me
#         double numberDays;
#         if(numberDaysInput > 180){
#             numberDays = 180;
#         }
#         else numberDays = numberDaysInput;        
#         double useScoreInput = ((totalLogins/numberDays) * 100);
#         double useScore;    
# //totalLogins =
# //select user_total_logins
# //from budgetbuddy.users
# //where budgetbuddy.users.user_id = 1

# //numberDaysInput = 
# //select current_date - budgetbuddy.users.user_registration_date + 1
# //from budgetbuddy.users
# //where budgetbuddy.users.user_id = 1;

#ESTIMATOR SCORE VARIABLES
    onlyMonths = datetime.datetime.today().date() - relativedelta(months = 6)
    monthCurDate = datetime.datetime.today().month
    #need past six months, not 180 days. Should not inlcude current month either. If today
    # was August 16th, should return July 31st through February 1st. My postgres code 
    # is able to do this so RAW SQL might be better here
    totExpQuery = Expense.objects.annotate(
                month=ExtractMonth('receipt__receipt_date'),
        ).filter(receipt__user_id = user_id,
                receipt__receipt_date__date__gte = onlyMonths,
    ).exclude(month = monthCurDate).aggregate(totalSpent=Sum('expense_price'))

    totIncQuery = Income.objects.annotate(
                month=ExtractMonth('receipt__receipt_date'),
        ).filter(receipt__user_id = user_id,
                receipt__receipt_date__date__gte = onlyMonths,
    ).exclude(month = monthCurDate).aggregate(totalIncomeReceived=Sum('income_amount'))

    totalExpensesEstimator = totExpQuery['totalSpent'] if totExpQuery['totalSpent'] is not None else 0
    totalIncomeEstimator = totIncQuery['totalIncomeReceived'] if totIncQuery['totalIncomeReceived'] is not None else 0
    actualAmounts = totalExpensesEstimator + totalIncomeEstimator
    #tempUserInfoTwo = UserCategoryBudget.objects.filter(user_id=user_id).values('user_category_budget_estimated_amount')

    budgEstQuery = UserCategoryBudget.objects.annotate(
                      month=ExtractMonth('user_category_budget_date'),
            ).filter(
            user_id = user_id, 
            user_category_budget_date__date__gte = onlyMonths,
            ).exclude(month = monthCurDate
            ).aggregate(
                sumEst = Sum('user_category_budget_estimated_amount'))

    estimatedAmounts = budgEstQuery['sumEst'] if budgEstQuery['sumEst'] is not None else 0

    estimatorScore = None

# //actual amounts =
# //SELECT
# //(SELECT SUM(expense_price) 
# //from budgetbuddy.expense
# //INNER JOIN budgetbuddy.receipt
# //ON budgetbuddy.expense.receipt_id = budgetbuddy.receipt.receipt_id
# //where budgetbuddy.receipt.receipt_date >=  to_char(CURRENT_DATE - INTERVAL '6 months', 'YYYY-MM-01')::date
# //AND (select date_part('month', budgetbuddy.receipt.receipt_date)) != 
# //(select date_part('month', CURRENT_DATE))
# //AND budgetbuddy.receipt.user_id = 1)
# //+
# //(SELECT SUM(income_amount) 
# //from budgetbuddy.income
# //INNER JOIN budgetbuddy.receipt
# //ON budgetbuddy.income.receipt_id = budgetbuddy.receipt.receipt_id
# //where budgetbuddy.receipt.receipt_date >=  to_char(CURRENT_DATE - INTERVAL '6 months', 'YYYY-MM-01')::date
# //AND (select date_part('month', budgetbuddy.receipt.receipt_date)) != 
# //(select date_part('month', CURRENT_DATE))
# //AND budgetbuddy.receipt.user_id = 1)

# //estimatedAmounts = 
# //SELECT SUM(user_category_budget_estimated_amount) 
# //from budgetbuddy.user_category_budget
# //where budgetbuddy.user_category_budget.user_category_budget_date >=  to_char(CURRENT_DATE - INTERVAL '6 months', 'YYYY-MM-01')::date
# //AND (select date_part('month', budgetbuddy.user_category_budget.user_category_budget_date)) != 
# //(select date_part('month', CURRENT_DATE))
# //AND budgetbuddy.user_category_budget.user_id = 1
        
#//OTHER VARIABLES
    totalBudgetScore = None
    
# //WANT SCORE LOGIC
    if totalIncomeTwo == 0:
        wantScore = 75
    else:
        wantScoreInput = ((totalWantsTwo/totalIncomeTwo) * 100)
        if wantScoreInput < 23:
            wantScore = 100         
        elif wantScoreInput >= 23 and wantScoreInput <= 99:
            wantScore = (((1.52292 * (10**-4)) * (wantScoreInput**3)) 
                + (-.03198 * (wantScoreInput**2))
                + (.715773 * wantScoreInput) + (98.62937))      
        else:
            wantScore = 0

# //APP USAGE LOGIC
    if useScoreInput > 85:
        useScore = 100         
    elif useScoreInput <= 85 and useScoreInput >= 1:
        useScore = (((8.6666 * (10**-5)) * (useScoreInput**3))
            + (-.02647 * (useScoreInput**2))       
            + (2.7419899 * useScoreInput) + (4.86581))           
    else:
        useScore = 0

# //ESTIMATION ACCURACY LOGIC
    if estimatedAmounts == 0:
        estimatorScore = 75
    else:
        if actualAmounts >= estimatedAmounts and actualAmounts/estimatedAmounts < 2:
            estimatorScore = 100 - (((actualAmounts/estimatedAmounts) - 1) * 100)
        elif actualAmounts < estimatedAmounts:
            estimatorScore = (actualAmounts/estimatedAmounts) * 100         
        else:
            estimatorScore = 0    
    
# //WEIGHTED SCORES
    out = (int)((wantScore * .5) + (useScore * .3) + (estimatorScore * .2))
# //total may seem off but it isn't because it is not actually 
# //made into an INT until all score are combined

    return Response(out)

