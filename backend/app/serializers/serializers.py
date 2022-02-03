from django.contrib.auth.models import User
from rest_framework import exceptions, serializers
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from rest_framework.fields import FileField
from app.models import *
from app.baseSerializers import *


class InitialBudgetSerializer(serializers.Serializer):

    class CustomUserSerializer(serializers.ModelSerializer):
        class Meta:
            model = Users 
            fields = ['user_id']

    class CustomCatUsBudgetSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserCategoryBudget
            fields = ['category', 'user_category_budget_estimated_amount', 'user_category_budget_altered_amount']
    
    budgets = CustomCatUsBudgetSerializer(UserCategoryBudget.objects.all(), many = True)

    class Meta:
        fields = ['budgets']

class IncomeReceiptSerializer(serializers.Serializer):

    recQuer = Receipt.objects.all()
    receipt = ReceiptSerializer(recQuer)

    incomQuer = Income.objects.all()
    incomes = IncomeSerializer(incomQuer, many=True)

    
    class Meta:
        fields = ['incomes', 'receipt']

class ExpenseReceiptSerializer(serializers.Serializer):
    recQuer = Receipt.objects.all()
    receipt = ReceiptSerializer(recQuer)

    expenQuer = Expense.objects.all()
    expenses = ExpenseSerializer(expenQuer, many=True)
    
    class Meta:
        fields = ['expenses', 'receipt']


class UserRegistrationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Users 
        fields = ['user_first_name', 'user_last_name',
        'user_user_name','user_birth_date', 'user_email', 'user_phone_number',
        'password', 'user_has_notifications']
    
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



