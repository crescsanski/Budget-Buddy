from django.contrib.auth import password_validation
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework import permissions, renderers, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from app.models import *
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from app.serializers import *
from django.contrib import auth

class SecurityQuestionViewSet(viewsets.ModelViewSet):
    queryset = SecurityQuestion.objects.all()
    serializer_class = SecurityQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

class UsersViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    Additionally we also provide an extra `highlight` action.
    """
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def highlight(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class AvatarViewSet(viewsets.ModelViewSet):
    queryset = Avatar.objects.all()
    serializer_class = AvatarSerializer
    permission_classes = [permissions.IsAuthenticated]

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChallengeInventoryViewSet(viewsets.ModelViewSet):
    queryset = ChallengeInventory.objects.all()
    serializer_class = ChallengeInventorySerializer
    permission_classes = [permissions.IsAuthenticated]

class CompetitionStatusViewSet(viewsets.ModelViewSet):
    queryset = CompetitionStatus.objects.all()
    serializer_class = CompetitionStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class CompetitionsViewSet(viewsets.ModelViewSet):
    queryset = Competitions.objects.all()
    serializer_class = CompetitionsSerializer
    permission_classes = [permissions.IsAuthenticated]

class DifficultyViewSet(viewsets.ModelViewSet):
    queryset = Difficulty.objects.all()
    serializer_class = DifficultySerializer
    permission_classes = [permissions.IsAuthenticated]

class FriendStatusViewSet(viewsets.ModelViewSet):
    queryset = FriendStatus.objects.all()
    serializer_class = FriendStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class FriendsViewSet(viewsets.ModelViewSet):
    queryset = Friends.objects.all()
    serializer_class = FriendsSerializer
    permission_classes = [permissions.IsAuthenticated]

class GlobalCompetitionsViewSet(viewsets.ModelViewSet):
    queryset = GlobalCompetitions.objects.all()
    serializer_class = GlobalCompetitionsSerializer
    permission_classes = [permissions.IsAuthenticated]

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ItemsViewSet(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer
    permission_classes = [permissions.IsAuthenticated]

class NotificationsViewSet(viewsets.ModelViewSet):
    queryset = Notifications.objects.all()
    serializer_class = NotificationsSerializer
    permission_classes = [permissions.IsAuthenticated]

class NotificationsListViewSet(viewsets.ModelViewSet):
    queryset = NotificationsList.objects.all()
    serializer_class = NotificationsListSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

class WidgetViewSet(viewsets.ModelViewSet):
    queryset = Widget.objects.all()
    serializer_class = WidgetSerializer
    permission_classes = [permissions.IsAuthenticated]

class WidgetInventoryViewSet(viewsets.ModelViewSet):
    queryset = WidgetInventory.objects.all()
    serializer_class = WidgetInventorySerializer
    permission_classes = [permissions.IsAuthenticated]


class RegisterView(GenericAPIView):

    permission_classes = (
    permissions.AllowAny,
     )

    @action(detail=False, methods=['post'])
    def post(self, request, *args, **kwargs):
        
        serializer = UsersSerializer(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        
        
        # First, let's check if the user name exists
        common = Users.objects.filter(username = user['username'])
        if len(common) > 0:
            raise Exception("A user with the given username already exists.  Please enter a different username.")
        # Next, let's validate the password:
        try:
            validate_password(user['password'], user = user.items(), password_validators=[MinimumLengthValidator(8), 
            CommonPasswordValidator(),
            NumericPasswordValidator(),
            UserAttributeSimilarityValidator()])
        except:
            return Response(password_validation.password_validators_help_texts())
        # Otherwise, if all correct, we create the user
        auth.get_user_model().objects.create_user(username = user['username'], password=user['password'], extra=user)
        return Response("User has been registered successfully!")


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
  
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'birth_date': user.birth_date,
            'email': user.email,
            'phone_number': user.phone_number,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'registered': user.registered
        })