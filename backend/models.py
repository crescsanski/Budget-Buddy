# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Budget(models.Model):
    budget_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey('Category', models.DO_NOTHING, blank=True, null=True)
    estimated_amount = models.IntegerField(blank=True, null=True)
    last_modified_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'budget'


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    category_description = models.CharField(max_length=255)
    category_income = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'category'


class Challenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    challenge_name = models.CharField(max_length=255)
    challenge_description = models.CharField(max_length=255)
    challenge_type = models.CharField(max_length=255)
    challenge_time_given = models.IntegerField()
    challenge_repeatable = models.BooleanField()
    active = models.BooleanField()
    experience = models.IntegerField(blank=True, null=True)
    item = models.ForeignKey('Items', models.DO_NOTHING, blank=True, null=True)
    difficulty = models.ForeignKey('Difficulty', models.DO_NOTHING, blank=True, null=True)
    trigger = models.ForeignKey('Trigger', models.DO_NOTHING, blank=True, null=True)
    minimum = models.IntegerField(blank=True, null=True)
    maximum = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'challenge'


class ChallengeInventory(models.Model):
    challenge_inventory_id = models.AutoField(primary_key=True)
    challenge_start_date = models.DateField()
    challenge_completion = models.DateTimeField(blank=True, null=True)
    challenge = models.ForeignKey(Challenge, models.DO_NOTHING, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'challenge_inventory'


class CompetitionStatus(models.Model):
    competition_status_id = models.AutoField(primary_key=True)
    competition_status_type = models.CharField(max_length=20)

    class Meta:
        managed = False
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
        managed = False
        db_table = 'competitions'
        unique_together = (('user', 'user_2_id'),)


class Difficulty(models.Model):
    difficulty_id = models.AutoField(primary_key=True)
    difficulty_name = models.CharField(max_length=255)
    difficulty_description = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'difficulty'


class FriendStatus(models.Model):
    friend_status_id = models.AutoField(primary_key=True)
    friend_status_type = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'friend_status'


class Friends(models.Model):
    friend_id = models.AutoField(primary_key=True)
    user_2_id = models.IntegerField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    friend_status = models.ForeignKey(FriendStatus, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
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
        managed = False
        db_table = 'global_competitions'


class Income(models.Model):
    income_id = models.AutoField(primary_key=True)
    income_name = models.CharField(max_length=255)
    income_amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'income'


class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    equipped = models.BooleanField()
    item = models.ForeignKey('Items', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'inventory'


class Items(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=255)
    item_description = models.CharField(max_length=255)
    item_type = models.CharField(max_length=255)
    item_link = models.CharField(max_length=255)
    difficulty = models.ForeignKey(Difficulty, models.DO_NOTHING, blank=True, null=True)
    unlock_level = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'items'


class Levels(models.Model):
    level_id = models.AutoField(primary_key=True)
    level_number = models.IntegerField()
    level_exp = models.IntegerField()
    item = models.ForeignKey(Items, models.DO_NOTHING, blank=True, null=True)
    challenge = models.ForeignKey(Challenge, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'levels'


class Notifications(models.Model):
    notification_id = models.AutoField(primary_key=True)
    notification_name = models.CharField(max_length=255)
    notification_message = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'notifications'


class NotificationsList(models.Model):
    notification_list_id = models.AutoField(primary_key=True)
    notification_time = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    notification = models.ForeignKey(Notifications, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notifications_list'


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.ForeignKey('Receipt', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING, blank=True, null=True)
    essential = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product'


class Receipt(models.Model):
    receipt_id = models.AutoField(primary_key=True)
    receipt_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    receipt_date = models.DateTimeField()
    reccuring = models.IntegerField()
    income = models.BooleanField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

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


class Trigger(models.Model):
    trigger_id = models.AutoField(primary_key=True)
    trigger_names = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'trigger'


class UserBudgetGoal(models.Model):
    goal_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    goal_amount = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_budget_goal'


class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=255)
    pass_field = models.CharField(db_column='pass', max_length=255)  # Field renamed because it was a Python reserved word.
    security_question = models.ForeignKey(SecurityQuestion, models.DO_NOTHING, blank=True, null=True)
    security_answer = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    user_name = models.CharField(unique=True, max_length=255)
    phone_number = models.CharField(unique=True, max_length=14, blank=True, null=True)
    registered = models.DateField()
    birth_date = models.DateField()
    notifications = models.BooleanField()
    user_exp = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class Widget(models.Model):
    widget_id = models.AutoField(primary_key=True)
    widget_name = models.CharField(max_length=255)
    widget_description = models.CharField(max_length=255)
    widget_link = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'widget'


class WidgetInventory(models.Model):
    widget_inventory_id = models.AutoField(primary_key=True)
    widget_position = models.IntegerField(blank=True, null=True)
    widget = models.ForeignKey(Widget, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(Users, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'widget_inventory'
