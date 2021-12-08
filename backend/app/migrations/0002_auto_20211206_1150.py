# Generated by Django 3.2.7 on 2021-12-06 16:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='challengeinventory',
            name='challenge_completion',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterModelTable(
            name='badgesearned',
            table='badges_earned',
        ),
    ]