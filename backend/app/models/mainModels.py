from django.db import models
from rest_framework.authtoken.models import Token
from django.core.validators import EmailValidator, RegexValidator
from datetime import date
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    category_description = models.CharField(max_length=255)
    category_type = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'category'


class Challenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    challenge_name = models.CharField(max_length=255)
    challenge_description = models.CharField(max_length=255)
    challenge_type = models.CharField(max_length=255)
    challenge_time_given = models.IntegerField()
    challenge_is_repeatable = models.BooleanField()
    challenge_is_active = models.BooleanField()
    challenge_experience_points = models.IntegerField(blank=True, null=True)
    challenge_start_ammount = models.IntegerField(blank=True, null=True)
    challenge_completion_ammount = models.IntegerField(blank=True, null=True)
    item = models.ForeignKey('Item', models.DO_NOTHING, blank=True, null=True)
    difficulty = models.IntegerField(blank=True, null=True)
    challenge_trigger = models.ForeignKey('ChallengeTrigger', models.DO_NOTHING, blank=True, null=True)
    experience_level_unlock = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'challenge'


class ChallengeTrigger(models.Model):
    challenge_trigger_id = models.AutoField(primary_key=True)
    challenge_trigger_name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'challenge_trigger'


class Competition(models.Model):
    competition_id = models.AutoField(primary_key=True)
    competition_type = models.CharField(max_length=255, blank=True, null=True)
    user_2_id = models.IntegerField()
    competition_status_type = models.CharField(max_length=20)
    competition_start_date = models.DateField()
    competition_winner = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'competition'
        unique_together = (('user', 'user_2_id'),)


class Expense(models.Model):
    expense_id = models.AutoField(primary_key=True)
    expense_name = models.CharField(max_length=255)
    expense_price = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'expense'


class Experience(models.Model):
    experience_id = models.AutoField(primary_key=True)
    experience_level = models.IntegerField()
    experience_title = models.CharField(max_length=255)
    experience_point_threshold = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'experience'


class Friend(models.Model):
    friend_id = models.AutoField(primary_key=True)
    user_2_id = models.IntegerField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    friend_status_type = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'friend'
        unique_together = (('user', 'user_2_id'),)


class GlobalCompetition(models.Model):
    global_competition_id = models.AutoField(primary_key=True)
    global_competition_type = models.CharField(max_length=255, blank=True, null=True)
    budget_percent_goal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    ranking = models.IntegerField()
    competition_start_date = models.DateField()
    competition_winner = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'global_competition'


class Income(models.Model):
    income_id = models.AutoField(primary_key=True)
    income_name = models.CharField(max_length=255)
    income_amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'income'


class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=255)
    item_description = models.CharField(max_length=255)
    item_type = models.CharField(max_length=255)
    item_link = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=255, blank=True, null=True)
    experience_level_unlock = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'item'


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    notification_name = models.CharField(max_length=255)
    notification_message = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'notification'


class Receipt(models.Model):
    receipt_id = models.AutoField(primary_key=True)
    receipt_date = models.DateTimeField()
    receipt_is_reccuring = models.IntegerField()
    receipt_is_income = models.BooleanField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    receipt_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'receipt'


class SecurityQuestion(models.Model):
    security_question_id = models.AutoField(primary_key=True)
    security_question_name = models.CharField(max_length=255)
    security_question_question = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'security_question'


class UserCategoryBudget(models.Model):
    user_category_budget_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)
    user_category_budget_estimated_amount = models.IntegerField(blank=True, null=True)
    user_category_budget_altered_amount = models.IntegerField(blank=True, null=True)
    user_category_budget_last_modified_date = models.DateTimeField(blank=True, null=True)
    user_category_budget_date = models.DateTimeField(blank=True, null=True)
    user_category_budget_favorite = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_category_budget'


class UserChallengeInventory(models.Model):
    user_challenge_inventory_id = models.AutoField(primary_key=True)
    user_challenge_start_date = models.DateField()
    user_challenge_completion_date = models.DateTimeField(blank=True, null=True)
    user_challenge_current_amount = models.IntegerField(blank=True, null=True)
    challenge = models.ForeignKey(Challenge, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_challenge_inventory'


class UserItemInventory(models.Model):
    user_item_inventory_id = models.AutoField(primary_key=True)
    user_item_is_equipped = models.BooleanField()
    item = models.ForeignKey(Item, models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'user_item_inventory'


class UserNotificationList(models.Model):
    user_notification_list_id = models.AutoField(primary_key=True)
    user_notification_list_time = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    notification = models.ForeignKey(Notification, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_notification_list'


class UserWidgetInventory(models.Model):
    user_widget_inventory_id = models.AutoField(primary_key=True)
    user_widget_position = models.IntegerField(blank=True, null=True)
    widget = models.ForeignKey('Widget', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_widget_inventory'


class Widget(models.Model):
    widget_id = models.AutoField(primary_key=True)
    widget_name = models.CharField(max_length=255)
    widget_description = models.CharField(max_length=255)
    widget_link = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'widget'

class MyUserManager(BaseUserManager):
    def create_user(self, username, password=None, extra=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        userFields = [a.name for a in Users._meta.get_fields() if a.name != 'user_user_name']
        default = dict.fromkeys(userFields, "")
        default['is_active'] = True
                     
        if extra == None:
            user = self.model(
                user_user_name=username,
                **default
            )
        else:
            user = self.model(
                **extra,
                user_registration_date = date.today()
            )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_user_name, password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            username=user_user_name,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user





class Users(AbstractBaseUser, models.Model):
    user_id = models.AutoField(primary_key=True)
    user_first_name = models.CharField(max_length=255, blank=True, null=True)
    user_last_name = models.CharField(max_length=255, blank=True, null=True)
    user_user_name = models.CharField(unique=True, max_length=255)
    user_email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    user_phone_number = models.CharField(unique=True, max_length=14, blank=True, null=True)
    user_registration_date = models.DateField()
    user_birth_date = models.DateField()
    user_has_notifications = models.BooleanField()
    user_current_experience_points = models.IntegerField(blank=True, null=True)
    user_required_experience_points = models.IntegerField(blank=True, null=True)
    user_level = models.IntegerField(blank=True, null=True)
    security_question = models.ForeignKey(SecurityQuestion, models.DO_NOTHING, blank=True, null=True)
    user_security_question_answer = models.CharField(max_length=255)
    is_active = models.BooleanField(blank=True, null=True)
    is_admin = models.BooleanField(blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    user_total_logins = models.IntegerField(blank=True, null=True)
    user_auto_renewal = models.BooleanField(blank=True, null=True)


    objects = MyUserManager()

    USERNAME_FIELD = 'user_user_name'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    class Meta:
        managed = False
        db_table = 'users'

