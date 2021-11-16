from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from datetime import date
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

class SecurityQuestion(models.Model):
    security_question_id = models.AutoField(primary_key=True)
    security_question_name = models.CharField(max_length=255)
    security_question_question = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'security_question'

class MyUserManager(BaseUserManager):
    def create_user(self, username, password=None, extra=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
    
        if extra == None:
            user = self.model(
                username=username
            )
        else:
            user = self.model(
                username=username,
                email=extra['email'] if 'email' in extra.keys() else None,
                first_name=extra['first_name'] if 'first_name' in extra.keys() else None,
                last_name=extra['last_name'] if 'last_name' in extra.keys() else None,
                birth_date=extra['birth_date'] if 'birth_date' in extra.keys() else None,
                notifications=extra['notifications'] if 'notifications' in extra.keys() else None,
                registered=date.today(),
                phone_number=extra['phone_number'] if 'phone_number' in extra.keys() else None,
            )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            username=username,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser, models.Model):
    email = models.EmailField(
        verbose_name='email address',
        validators=[EmailValidator()],
        max_length=255,
        unique=True,
        blank=True,
        null=True
    )
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(unique=True, max_length=255)
    phone_number = models.CharField(unique=True, max_length=14, blank=True, null=True)
    password = models.CharField(unique=True, max_length=255, blank=False, null=True)
    registered = models.DateField(null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    security_question = models.ForeignKey(SecurityQuestion, models.DO_NOTHING, blank=True, null=True)
    security_answer = models.CharField(max_length=255, blank=True, null=True)
    notifications = models.CharField(max_length = 1, validators = [RegexValidator('^[01]+$', message="The string can only include 0s or 1s.")], blank=True, null=True)


    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    objects = MyUserManager()

    USERNAME_FIELD = 'username'
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
        managed = True
        db_table = 'users'

class Avatar(models.Model):
    avatar_id = models.AutoField(primary_key=True)
    avatar_level = models.IntegerField(blank=True, null=True)
    avatar_exp = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'avatar'


class Budget(models.Model):
    budget_id = models.AutoField(primary_key=True)
    projected_income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    projected_expenses = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    additional_expenses_goal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    savings_goal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    savings_actual = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    expenses_actual = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    budget_percent_goal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'budget'


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    category_description = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'category'


class Challenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    challenge_name = models.CharField(max_length=255)
    challenge_description = models.CharField(max_length=255)
    challenge_type = models.CharField(max_length=255)
    active = models.CharField(max_length = 1, validators = [RegexValidator('^[01]+$', message="The string can only include 0s or 1s.")], blank=True, null=True)
    challenge_time_given = models.IntegerField(blank=True, null=True)
    challenge_repeatable = models.CharField(max_length = 1, validators = [RegexValidator('^[01]+$', message="The string can only include 0s or 1s.")], blank=True, null=True)
    item = models.ForeignKey('Items', models.DO_NOTHING, blank=True, null=True)
    difficulty = models.ForeignKey('Difficulty', models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'challenge'


class ChallengeInventory(models.Model):
    challenge_inventory_id = models.AutoField(primary_key=True)
    challenge_start_date = models.DateField()
    challenge_completion = models.CharField(max_length = 1, validators = [RegexValidator('^[01]+$', message="The string can only include 0s or 1s.")], blank=True, null=True)
    challenge = models.ForeignKey(Challenge, models.DO_NOTHING, blank=True, null=True)
    avatar = models.ForeignKey(Avatar, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'challenge_inventory'


class CompetitionStatus(models.Model):
    competition_status_id = models.AutoField(primary_key=True)
    competition_status_type = models.CharField(max_length=20)


    class Meta:
        managed = True
        db_table = 'competition_status'


class Competitions(models.Model):
    competition_id = models.AutoField(primary_key=True)
    competition_type = models.CharField(max_length=255, blank=True, null=True)
    user_2_id = models.IntegerField()
    competition_start_date = models.DateField()
    competition_winner = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    competition_status = models.ForeignKey(CompetitionStatus, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'competitions'
        unique_together = (('user', 'user_2_id'),)


class Difficulty(models.Model):
    difficulty_id = models.AutoField(primary_key=True)
    difficulty_name = models.CharField(max_length=255)
    difficulty_description = models.CharField(max_length=255)


    class Meta:
        managed = True
        db_table = 'difficulty'


class FriendStatus(models.Model):
    friend_status_id = models.AutoField(primary_key=True)
    friend_status_type = models.CharField(max_length=20)


    class Meta:
        managed = True
        db_table = 'friend_status'


class Friends(models.Model):
    friend_id = models.AutoField(primary_key=True)
    user_2_id = models.IntegerField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    friend_status = models.OneToOneField(FriendStatus, models.DO_NOTHING)


    class Meta:
        managed = True
        db_table = 'friends'
        unique_together = (('user', 'user_2_id'),)


class GlobalCompetitions(models.Model):
    global_competition_id = models.AutoField(primary_key=True)
    global_competition_type = models.CharField(max_length=255, blank=True, null=True)
    budget_percent_goal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    ranking = models.IntegerField()
    competition_start_date = models.DateField()
    competition_winner = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'global_competitions'


class Income(models.Model):
    income_id = models.AutoField(primary_key=True)
    income_name = models.CharField(max_length=255)
    income_amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'income'


class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    equipped = models.CharField(max_length = 1, validators = [RegexValidator('^[01]+$', message="The string can only include 0s or 1s.")], blank=True, null=True)
    item = models.ForeignKey('Items', models.DO_NOTHING, blank=True, null=True)
    avatar = models.ForeignKey(Avatar, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'inventory'


class Items(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=255)
    item_description = models.CharField(max_length=255)
    item_type = models.CharField(max_length=255)
    item_link = models.CharField(max_length=255)
    difficulty = models.ForeignKey(Difficulty, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'items'


class Notifications(models.Model):
    notification_id = models.AutoField(primary_key=True)
    notification_name = models.CharField(max_length=255)
    notification_message = models.CharField(max_length=255)


    class Meta:
        managed = True
        db_table = 'notifications'


class NotificationsList(models.Model):
    notification_list_id = models.AutoField(primary_key=True)
    notification_time = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    notification = models.ForeignKey(Notifications, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'notifications_list'


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'product'


class Receipt(models.Model):
    receipt_id = models.AutoField(primary_key=True)
    receipt_amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt_date = models.DateField()
    reoccuring = models.IntegerField()
    is_income = models.TextField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)



    class Meta:
        managed = True
        db_table = 'receipt'


class Widget(models.Model):
    widget_id = models.AutoField(primary_key=True)
    widget_name = models.CharField(max_length=255)
    widget_description = models.CharField(max_length=255)
    widget_link = models.CharField(max_length=255)


    class Meta:
        managed = True
        db_table = 'widget'


class WidgetInventory(models.Model):
    widget_inventory_id = models.AutoField(primary_key=True)
    widget_position = models.IntegerField(blank=True, null=True)
    widget = models.ForeignKey(Widget, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(Users, models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'widget_inventory'
