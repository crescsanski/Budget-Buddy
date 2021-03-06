# Generated by Django 3.2.7 on 2022-04-13 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_first_name', models.CharField(blank=True, max_length=255, null=True)),
                ('user_last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('user_user_name', models.CharField(max_length=255, unique=True)),
                ('user_email', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('user_phone_number', models.CharField(blank=True, max_length=14, null=True, unique=True)),
                ('user_registration_date', models.DateField()),
                ('user_birth_date', models.DateField()),
                ('user_has_notifications', models.BooleanField()),
                ('user_current_experience_points', models.IntegerField(blank=True, null=True)),
                ('user_required_experience_points', models.IntegerField(blank=True, null=True)),
                ('user_level', models.IntegerField(blank=True, null=True)),
                ('user_security_question_answer', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(blank=True, null=True)),
                ('is_admin', models.BooleanField(blank=True, null=True)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('user_total_logins', models.IntegerField(blank=True, null=True)),
                ('user_auto_renewal', models.BooleanField(blank=True, null=True)),
            ],
            options={
                'db_table': 'users',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('category_id', models.AutoField(primary_key=True, serialize=False)),
                ('category_name', models.CharField(max_length=255)),
                ('category_description', models.CharField(max_length=255)),
                ('category_type', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'category',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('challenge_id', models.AutoField(primary_key=True, serialize=False)),
                ('challenge_name', models.CharField(max_length=255)),
                ('challenge_description', models.CharField(max_length=255)),
                ('challenge_badge_description', models.CharField(max_length=255)),
                ('challenge_unit_type', models.CharField(max_length=255)),
                ('challenge_type', models.CharField(max_length=255)),
                ('challenge_time_given', models.IntegerField()),
                ('challenge_is_repeatable', models.BooleanField()),
                ('challenge_is_active', models.BooleanField()),
                ('challenge_experience_points', models.IntegerField(blank=True, null=True)),
                ('challenge_start_amount', models.IntegerField(blank=True, null=True)),
                ('challenge_completion_amount', models.IntegerField(blank=True, null=True)),
                ('difficulty', models.IntegerField(blank=True, null=True)),
                ('challenge_trigger', models.CharField(max_length=255)),
                ('experience_level_unlock', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'challenge',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Competition',
            fields=[
                ('competition_id', models.AutoField(primary_key=True, serialize=False)),
                ('competition_type', models.CharField(blank=True, max_length=255, null=True)),
                ('user_2_id', models.IntegerField()),
                ('competition_status_type', models.CharField(max_length=20)),
                ('competition_start_date', models.DateField()),
                ('competition_winner', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'competition',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('expense_id', models.AutoField(primary_key=True, serialize=False)),
                ('expense_name', models.CharField(max_length=255)),
                ('expense_price', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'db_table': 'expense',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('experience_id', models.AutoField(primary_key=True, serialize=False)),
                ('experience_level', models.IntegerField()),
                ('experience_title', models.CharField(max_length=255)),
                ('experience_point_threshold', models.IntegerField()),
            ],
            options={
                'db_table': 'experience',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('friend_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_2_id', models.IntegerField()),
                ('friend_status_type', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'friend',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='GlobalCompetition',
            fields=[
                ('global_competition_id', models.AutoField(primary_key=True, serialize=False)),
                ('global_competition_type', models.CharField(blank=True, max_length=255, null=True)),
                ('budget_percent_goal', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('ranking', models.IntegerField()),
                ('competition_start_date', models.DateField()),
                ('competition_winner', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'global_competition',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Income',
            fields=[
                ('income_id', models.AutoField(primary_key=True, serialize=False)),
                ('income_name', models.CharField(max_length=255)),
                ('income_amount', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'db_table': 'income',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('item_id', models.AutoField(primary_key=True, serialize=False)),
                ('item_name', models.CharField(max_length=255)),
                ('item_description', models.CharField(max_length=255)),
                ('item_type', models.CharField(max_length=255)),
                ('item_link', models.CharField(max_length=255)),
                ('difficulty', models.CharField(blank=True, max_length=255, null=True)),
                ('experience_level_unlock', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'item',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('notification_id', models.AutoField(primary_key=True, serialize=False)),
                ('notification_name', models.CharField(max_length=255)),
                ('notification_message', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'notification',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('receipt_id', models.AutoField(primary_key=True, serialize=False)),
                ('receipt_date', models.DateTimeField()),
                ('receipt_is_reccuring', models.IntegerField()),
                ('receipt_is_income', models.BooleanField()),
                ('receipt_name', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'receipt',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='SecurityQuestion',
            fields=[
                ('security_question_id', models.AutoField(primary_key=True, serialize=False)),
                ('security_question_name', models.CharField(max_length=255)),
                ('security_question_question', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'security_question',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserCategoryBudget',
            fields=[
                ('user_category_budget_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_category_budget_estimated_amount', models.IntegerField(blank=True, null=True)),
                ('user_category_budget_altered_amount', models.IntegerField(blank=True, null=True)),
                ('user_category_budget_last_modified_date', models.DateTimeField(blank=True, null=True)),
                ('user_category_budget_date', models.DateTimeField(blank=True, null=True)),
                ('user_category_budget_favorite', models.BooleanField(blank=True, null=True)),
            ],
            options={
                'db_table': 'user_category_budget',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserChallengeInventory',
            fields=[
                ('user_challenge_inventory_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_challenge_start_date', models.DateField()),
                ('user_challenge_completion_date', models.DateTimeField(blank=True, null=True)),
                ('user_challenge_completion_amount', models.IntegerField(blank=True, null=True)),
                ('user_challenge_current_amount', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'user_challenge_inventory',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserItemInventory',
            fields=[
                ('user_item_inventory_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_item_is_equipped', models.BooleanField()),
            ],
            options={
                'db_table': 'user_item_inventory',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserNotificationList',
            fields=[
                ('user_notification_list_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_notification_list_time', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'user_notification_list',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserWidgetInventory',
            fields=[
                ('user_widget_inventory_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_widget_position', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'user_widget_inventory',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Widget',
            fields=[
                ('widget_id', models.AutoField(primary_key=True, serialize=False)),
                ('widget_name', models.CharField(max_length=255)),
                ('widget_description', models.CharField(max_length=255)),
                ('widget_link', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'widget',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UpBudgetModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_id', models.IntegerField()),
                ('altered_amount', models.IntegerField()),
                ('is_favorite', models.BooleanField()),
            ],
        ),
    ]
