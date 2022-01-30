
# from rest_framework.response import Response

# from rest_framework import permissions, renderers, viewsets
# from rest_framework.decorators import action

# from app.models import *

# from app.serializers import *

# class SecurityQuestionViewSet(viewsets.ModelViewSet):
#     queryset = SecurityQuestion.objects.all()
#     serializer_class = SecurityQuestionSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class UsersViewSet(viewsets.ModelViewSet):
#     """
#     This viewset automatically provides `list`, `create`, `retrieve`,
#     `update` and `destroy` actions.
#     Additionally we also provide an extra `highlight` action.
#     """
#     queryset = Users.objects.all()
#     serializer_class = UsersSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
#     def highlight(self, request, *args, **kwargs):
#         snippet = self.get_object()
#         return Response(snippet.highlighted)

#     def perform_create(self, serializer):
#         serializer.save(owner=self.request.user)


# class BudgetViewSet(viewsets.ModelViewSet):
#     queryset = Budget.objects.all()
#     serializer_class = BudgetSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     filterset_fields = '__all__'

# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer
#     permission_classes = [permissions.IsAuthenticated]
#     filterset_fields = '__all__'

#     @action(detail=False, methods=['GET'], name='Get Income')
#     def income(self, request, format=None):
#         queryset = Category.objects.filter(category_income = True)
#         serializer = CategorySerializer(queryset, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['GET'], name='Get Spending')
#     def spending(self, request, format=None):
#          queryset = Category.objects.filter(category_income = False)
#          serializer = CategorySerializer(queryset, many=True)
#          return Response(serializer.data)

# class ChallengeViewSet(viewsets.ModelViewSet):
#     queryset = Challenge.objects.all()
#     serializer_class = ChallengeSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class ChallengeInventoryViewSet(viewsets.ModelViewSet):
#     queryset = ChallengeInventory.objects.all()
#     serializer_class = ChallengeInventorySerializer
#     permission_classes = [permissions.IsAuthenticated]

#     # @action(detail=False, methods=['GET'], name='Get Completed Badges')
#     # def earnedBadges(self, request, format=None):
#     #      userId = self.kwargs.get(self.lookup_url_kwarg)
#     #      print("UserID: ", userId)
#     #      queryset = ChallengeInventory.objects.filter(challenge_completion = True, user = userId).prefetch_related('challenge')
#     #      serializer = ChallengeInventorySerializer(queryset, many=True)
#     #      return Response(serializer.data)

# class CompetitionStatusViewSet(viewsets.ModelViewSet):
#     queryset = CompetitionStatus.objects.all()
#     serializer_class = CompetitionStatusSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class CompetitionsViewSet(viewsets.ModelViewSet):
#     queryset = Competitions.objects.all()
#     serializer_class = CompetitionsSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class DifficultyViewSet(viewsets.ModelViewSet):
#     queryset = Difficulty.objects.all()
#     serializer_class = DifficultySerializer
#     permission_classes = [permissions.IsAuthenticated]

# class FriendStatusViewSet(viewsets.ModelViewSet):
#     queryset = FriendStatus.objects.all()
#     serializer_class = FriendStatusSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class FriendsViewSet(viewsets.ModelViewSet):
#     queryset = Friends.objects.all()
#     serializer_class = FriendsSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class GlobalCompetitionsViewSet(viewsets.ModelViewSet):
#     queryset = GlobalCompetitions.objects.all()
#     serializer_class = GlobalCompetitionsSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class IncomeViewSet(viewsets.ModelViewSet):
#     queryset = Income.objects.all()
#     serializer_class = IncomeSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class InventoryViewSet(viewsets.ModelViewSet):
#     queryset = Inventory.objects.all()
#     serializer_class = InventorySerializer
#     permission_classes = [permissions.IsAuthenticated]

# class ItemsViewSet(viewsets.ModelViewSet):
#     queryset = Items.objects.all()
#     serializer_class = ItemsSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class NotificationsViewSet(viewsets.ModelViewSet):
#     queryset = Notifications.objects.all()
#     serializer_class = NotificationsSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class LevelsViewSet(viewsets.ModelViewSet):
#     queryset = Levels.objects.all()
#     serializer_class = LevelsSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class BudgetGoalsViewSet(viewsets.ModelViewSet):
#     queryset = UserBudgetGoal.objects.all()
#     serializer_class = BudgetGoalSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class TriggerViewSet(viewsets.ModelViewSet):
#     queryset = Trigger.objects.all()
#     serializer_class = TriggerSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class NotificationsListViewSet(viewsets.ModelViewSet):
#     queryset = NotificationsList.objects.all()
#     serializer_class = NotificationsListSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class ProductViewSet(viewsets.ModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class ReceiptViewSet(viewsets.ModelViewSet):
#     queryset = Receipt.objects.all()
#     serializer_class = ReceiptSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class WidgetViewSet(viewsets.ModelViewSet):
#     queryset = Widget.objects.all()
#     serializer_class = WidgetSerializer
#     permission_classes = [permissions.IsAuthenticated]

# class WidgetInventoryViewSet(viewsets.ModelViewSet):
#     queryset = WidgetInventory.objects.all()
#     serializer_class = WidgetInventorySerializer
#     permission_classes = [permissions.IsAuthenticated]

