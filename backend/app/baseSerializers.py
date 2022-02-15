from django.contrib.auth.models import User
from rest_framework import exceptions, serializers
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from rest_framework.fields import FileField
from .models import *

class SecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = '__all__'

class UsersSerializer(serializers.ModelSerializer):
   class Meta:
       model = Users 
       fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class ValidateChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserChallengeInventory
        fields = ['user', 'challenge']

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCategoryBudget
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# class LevelsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Levels
#         fields = '__all__'


class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeTrigger
        fields = '__all__'
    
class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class ChallengeInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserChallengeInventory
        fields = '__all__'

class CompetitionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'

class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = '__all__'

class GlobalCompetitionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalCompetition
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserItemInventory
        fields = '__all__'

class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class NotificationsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotificationList
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
    
class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'

class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = '__all__'

class WidgetInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWidgetInventory
        fields = '__all__'



