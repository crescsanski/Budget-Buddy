from django.db import models
from datetime import date
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

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
        db_table = 'users'