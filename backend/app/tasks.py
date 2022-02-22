import datetime
from threading import Timer
from django.contrib.auth.hashers import *
import threading

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
      #t = Timer(self.counter, mainGameOrigin)
      #t.start()

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

#This function should trigger once every hour to update the state of the game.
def mainGameOrigin():
   pass
   # Expense.objects.filter(receipt__user_id=54).delete()
   # Income.objects.filter(receipt__user_id=54).delete()
   # Receipt.objects.filter(user_id = 54).delete()
   # 

#       #For each user....

#       #We need to update their experience points
#       updateExperPoints(user.pk)

#       #We need to modify their level (if applicable)
#       updateLevel(user.pk)

#       #We need to call SQL procedures to verify the completion of challenges
#       #If completed, the corresponding reward should be granted.
#       verifyChallenges(user.pk)

#       #We need to swap out expired challenges with new ones.
#       assignNewChallenges(user.pk)

# def updateExperPoints(userPk):
#    pass

# def updateLevel(userPk):
#    pass

# def verifyChallenges(userPk):
#    pass

# def assignNewChallenges(userPk):
#    pass



