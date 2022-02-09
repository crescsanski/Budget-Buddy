from threading import Timer
from django.contrib.auth.hashers import *
import threading
from app.models import Users

class gameThread(threading.Thread):
   def __init__(self, counter):
      threading.Thread.__init__(self)
      self.counter = counter
   def run(self):

      t = Timer(self.counter, mainGameOrigin)
      t.start()

#This function should trigger once every hour to update the state of the game.
def mainGameOrigin():
   # We need to iterate over each user in the database.
   for user in Users.objects.all():

      #If the user's password is unusable, replace it with the default
      password = user.password
      if len(password) < 12:
         print("Invalid Password: ", password)
         fixedPassword = make_password(password)
         Users.objects.filter(user_id = user.user_id).update(password = fixedPassword)

      #For each user....

      #We need to update their experience points
      updateExperPoints(user.pk)

      #We need to modify their level (if applicable)
      updateLevel(user.pk)

      #We need to call SQL procedures to verify the completion of challenges
      #If completed, the corresponding reward should be granted.
      verifyChallenges(user.pk)

      #We need to swap out expired challenges with new ones.
      assignNewChallenges(user.pk)

def updateExperPoints(userPk):
   pass

def updateLevel(userPk):
   pass

def verifyChallenges(userPk):
   pass

def assignNewChallenges(userPk):
   pass



