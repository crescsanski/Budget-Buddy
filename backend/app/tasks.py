import datetime
from django.contrib.auth.hashers import *
import threading
from django.db import connection
from apscheduler.schedulers.background import BackgroundScheduler

from app.models import Users, UserCategoryBudget, Expense, Income, Receipt

class gameThread(threading.Thread):
   def __init__(self):
      threading.Thread.__init__(self)

   def run(self):
      #fixPasswordAndActivateAccount()
      #activateBudgetsForThisMonth()
      scheduler = BackgroundScheduler()
      scheduler.add_job(gameTasks, 'cron', hour='0', minute='0', second = '0')
      scheduler.start()
    


def gameTasks():
   if datetime.datetime.now().day == 1:
      with connection.cursor() as cursor:
         # Call procedures to run on first day of month
         cursor.execute('CALL budgetbuddy.monthly_weekly_challenge_check();')
         cursor.execute('CALL budgetbuddy.month_end_challenge_removal();')
         cursor.execute('CALL budgetbuddy.auto_renewal_procedure();')
   if datetime.datetime.now().day == 3:
      with connection.cursor() as cursor:
         # Call procedures to run on thrid day of month
         cursor.execute('CALL budgetbuddy.reset_user_budget_alterations();')
         cursor.execute('CALL budgetbuddy.insert_random_monthly_challenges();')
         cursor.execute('CALL budgetbuddy.insert_random_first_week_challenges();')
   if datetime.datetime.now().day == 8 or datetime.datetime.now().day == 15 or datetime.datetime.now().day == 22:
      with connection.cursor() as cursor:
         # Call procedures to run on eigth day of month
         cursor.execute('CALL budgetbuddy.weekly_challenge_check();')
         cursor.execute('CALL budgetbuddy.week_end_challenge_removal();')
         cursor.execute('CALL budgetbuddy.insert_random_following_week_challenges();')

def fixPasswordAndActivateAccount():
   for user in Users.objects.all():

      #If the user's password is unusable, replace it with the default
      password = user.password
      
      if len(password) < 12:
         print("Invalid Password: ", password)
         fixedPassword = make_password(password)
         Users.objects.filter(user_id = user.user_id).update(password = fixedPassword)

      if user.is_active == None:
         print("The user is inactive.")
         Users.objects.filter(user_id = user.user_id).update(is_active = True)

def activateBudgetsForThisMonth():
   today = datetime.date.today()
   for budget in UserCategoryBudget.objects.all():
      date = budget.user_category_budget_date
      if date is None:
         print("The budget is missing a date.")
         UserCategoryBudget.objects.filter(pk=budget.pk).update(user_category_budget_date = today)





