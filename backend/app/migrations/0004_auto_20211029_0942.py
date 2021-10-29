# Generated by Django 3.2.7 on 2021-10-29 13:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20211028_1444'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='birth_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='users',
            name='email',
            field=models.EmailField(blank=True, default=django.utils.timezone.now, max_length=255, unique=True, verbose_name='email address'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='users',
            name='password',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
    ]