from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework import exceptions
from datetime import datetime, timedelta
import pytz
from rest_framework.authtoken.models import Token

class TokenExpireAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token.')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted.')

        # This is required for the time comparison
        utc_now = datetime.utcnow()
        utc_now = utc_now.replace(tzinfo=pytz.utc)

        #invalidate the token if its older than 30 minutes
        if token.created < utc_now - timedelta(minutes=30):
            #delete the expired token from the database
            Token.objects.filter(user=token.user).delete()
            raise exceptions.AuthenticationFailed('Token has expired')

        return (token.user, token)