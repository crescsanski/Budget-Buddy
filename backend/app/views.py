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
from django.contrib.auth import get_user_model, logout
from rest_framework.response import Response
from app.models import *
from django.contrib.auth.password_validation import CommonPasswordValidator, NumericPasswordValidator, UserAttributeSimilarityValidator, validate_password, MinimumLengthValidator
from app.serializers import *
from django.contrib import auth
from django.db import connection

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


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = '__all__'

    @action(detail=False, methods=['GET'], name='Get Income')
    def income(self, request, format=None):
        queryset = Category.objects.filter(category_income = True)
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Get Spending')
    def spending(self, request, format=None):
         queryset = Category.objects.filter(category_income = False)
         serializer = CategorySerializer(queryset, many=True)
         return Response(serializer.data)

class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChallengeInventoryViewSet(viewsets.ModelViewSet):
    queryset = ChallengeInventory.objects.all()
    serializer_class = ChallengeInventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    # @action(detail=False, methods=['GET'], name='Get Completed Badges')
    # def earnedBadges(self, request, format=None):
    #      userId = self.kwargs.get(self.lookup_url_kwarg)
    #      print("UserID: ", userId)
    #      queryset = ChallengeInventory.objects.filter(challenge_completion = True, user = userId).prefetch_related('challenge')
    #      serializer = ChallengeInventorySerializer(queryset, many=True)
    #      return Response(serializer.data)

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

class LevelsViewSet(viewsets.ModelViewSet):
    queryset = Levels.objects.all()
    serializer_class = LevelsSerializer
    permission_classes = [permissions.IsAuthenticated]

class BudgetGoalsViewSet(viewsets.ModelViewSet):
    queryset = UserBudgetGoal.objects.all()
    serializer_class = BudgetGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

class TriggerViewSet(viewsets.ModelViewSet):
    queryset = Trigger.objects.all()
    serializer_class = TriggerSerializer
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
        
        serializer = UserRegistrationSerializer(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        
        
        # First, let's check if the user name exists
        common = Users.objects.filter(username = user['username'])
        if len(common) > 0:
            raise Exception("A user with the given username already exists.  Please enter a different username.")
                
        # Otherwise, if all correct, we create the user
        auth.get_user_model().objects.create_user(username = user['username'], password=user['password'], extra=user)
        return Response("User has been registered successfully!")


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
  
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Remove any old tokens for the user if they exist
        Token.objects.filter(user=user).delete()

        # Create a new token for the user
        token = Token.objects.create(user=user)

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
    
class Logout(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def post(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)

class ValidateChallenge(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ValidateChallengeSerializer
    
    @action(detail=False, methods=['post'])
    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
  
        serializer.is_valid(raise_exception=True)

        type = serializer.validated_data

        with connection.cursor() as cursor:
            cursor.callproc('validate_challenge', [type.user, type.challenge])
            result = cursor.fetchall()
        

        return Response(result)


# Views for Database Views

class BadgesEarnedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BadgesEarned.objects.all()
    serializer_class = BadgesEarnedSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        queryset = BadgesEarned.objects.filter(user_id = pk)
        serializer = BadgesEarnedSerializer(queryset, many=True)
        return Response(serializer.data)

