from rest_framework import serializers
 
from .models import Users

class UsersSerializer(serializers.HyperlinkedModelSerializer):
   class Meta:
       model = Users 
       fields = ('user_id',
                'first_name',
                'last_name',
                'email',
                'username',
                'phone_number',
                'registered',
                'birth_date',
                'password')
