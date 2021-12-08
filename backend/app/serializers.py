from django.contrib.auth.models import User
from rest_framework import exceptions, serializers
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from .models import *

class SecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = '__all__'

class UsersSerializer(serializers.ModelSerializer):
   class Meta:
       model = Users 
       fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
       model = Users 
       fields = '__all__'
    
    #Validate password
    def validate(self, data):
        user = Users(**data)
        password = data.get('password')
        errors = dict()
        try:
            validate_password(password=password, user=user, 
            password_validators=[MinimumLengthValidator(8), 
            CommonPasswordValidator(),
            NumericPasswordValidator(),
            UserAttributeSimilarityValidator()])
        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(UserRegistrationSerializer, self).validate(data)

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class LevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Levels
        fields = '__all__'

class BudgetGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBudgetGoal
        fields = '__all__'

class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trigger
        fields = '__all__'
    
class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class ChallengeInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeInventory
        fields = '__all__'

class CompetitionStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionStatus
        fields = '__all__'

class CompetitionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competitions
        fields = '__all__'

class DifficultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Difficulty
        fields = '__all__'

class FriendStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendStatus
        fields = '__all__'

class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends
        fields = '__all__'

class GlobalCompetitionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalCompetitions
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'

class NotificationsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationsList
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
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
        model = WidgetInventory
        fields = '__all__'

# Serializers for Database Views

class BadgesEarnedSerializer(serializers.ModelSerializer):
    class Meta:
        model = BadgesEarned
        fields = '__all__'



