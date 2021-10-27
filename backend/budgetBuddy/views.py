from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import password_validation
from django.contrib.auth.password_validation import CommonPasswordValidator, MinimumLengthValidator, 
from django.db.models import Q
from app import views
from models import Users

class Authenticate(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'registered': user.registered,
            'birth_date': user.birth_date
        })

class Register(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        # First, let's check if the user name exists
        try: 
            Users.objects.get(user_name = user.username)
        except Users.DoesNotExist:
            return Response("Username already exists.  Please choose a different username", 
            status=status.HTTP_404_NOT_FOUND)
        # Next, let's validate the password:
        
        # Otherwise, if all correct, we create the user
        Users.objects.create(user)
        return Response("User has been registered successfully!")

       