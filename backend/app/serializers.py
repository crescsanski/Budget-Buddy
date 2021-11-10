from django.contrib.auth.models import User
from rest_framework import exceptions, serializers
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from .models import *

class SecurityQuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = '__all__'

class UsersSerializer(serializers.HyperlinkedModelSerializer):
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

class AvatarSerializer(serializers.HyperlinkedModelSerializer):
    class Meta: 
        model = Avatar
        fields = '__all__'

class BudgetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
    
class ChallengeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class ChallengeInventorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ChallengeInventory
        fields = '__all__'

class CompetitionStatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CompetitionStatus
        fields = '__all__'

class CompetitionsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Competitions
        fields = '__all__'

class DifficultySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Difficulty
        fields = '__all__'

class FriendStatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = FriendStatus
        fields = '__all__'

class FriendsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Friends
        fields = '__all__'

class GlobalCompetitionsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GlobalCompetitions
        fields = '__all__'

class IncomeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'

class InventorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class ItemsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'

class NotificationsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'

class NotificationsListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NotificationsList
        fields = '__all__'

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
    
class ReceiptSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'

class WidgetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Widget
        fields = '__all__'

class WidgetInventorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WidgetInventory
        fields = '__all__'



