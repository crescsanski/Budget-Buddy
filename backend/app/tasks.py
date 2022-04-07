import datetime
from threading import Timer
from django.contrib.auth.hashers import *
import threading
from django.db import connection
import schedule

from numpy import fix
from app.models import Users, UserCategoryBudget, Expense, Income, Receipt

class gameThread(threading.Thread):
   def __init__(self, counter):
      threading.Thread.__init__(self)
      self.counter = counter
   def run(self):
      pass
      #fixPasswordAndActivateAccount()
      #activateBudgetsForThisMonth()
      schedule.every().day.at("00:00:00").do(gameTasks)


def gameTasks():
   if datetime.datetime.now().day == 1:
      with connection.cursor() as cursor:
         # Call procedures to run on first day of month
         cursor.callproc('test_procedure')
   

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





