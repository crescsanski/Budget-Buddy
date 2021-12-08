from django.conf.urls import include, url
from django.urls import path
from rest_framework.routers import DefaultRouter
from app import views


# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'security_questions', views.SecurityQuestionViewSet)
router.register(r'users', views.UsersViewSet)
router.register(r'budgets', views.BudgetViewSet)
router.register(r'budget_goals', views.BudgetGoalsViewSet)
router.register(r'triggers', views.TriggerViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'challenges', views.ChallengeViewSet)
router.register(r'challenge_inventories', views.ChallengeInventoryViewSet)
router.register(r'competition_status', views.CompetitionStatusViewSet)
router.register(r'competitions', views.CompetitionsViewSet)
router.register(r'difficulties', views.DifficultyViewSet)
router.register(r'friend_status', views.FriendStatusViewSet)
router.register(r'friends', views.FriendStatusViewSet)
router.register(r'global_competitions', views.GlobalCompetitionsViewSet)
router.register(r'income', views.IncomeViewSet)
router.register(r'inventories', views.InventoryViewSet)
router.register(r'items', views.ItemsViewSet)
router.register(r'notifications', views.NotificationsViewSet)
router.register(r'notifications_lists', views.NotificationsListViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'receipts', views.ReceiptViewSet)
router.register(r'widgets', views.WidgetViewSet)
router.register(r'widget_inventories', views.WidgetInventoryViewSet)

#Register our database views
router.register(r'badges_earned', views.BadgesEarnedViewSet)



# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
app_name = 'app'
urlpatterns = [
    path('auth/',views.CustomAuthToken.as_view()),
    path('auth/logout/',views.Logout.as_view()),
    path('auth/register/', views.RegisterView.as_view()),
    path('validate_challenge/', views.ValidateChallenge.as_view()),
    path('', include(router.urls)),
]


from app import tasks

# Create a separate thread to execute tasks on timer
t1 = tasks.gameThread(5)

# Start the game logic thread:

t1.start()

