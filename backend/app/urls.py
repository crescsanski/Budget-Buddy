from django.conf.urls import include, url
from django.urls import path
from app.views.baseViews import *
from rest_framework.routers import DefaultRouter
from app import views

router= DefaultRouter()
router.register(r'category', CategoryViewSet, basename='category')

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
app_name = 'app'
urlpatterns = [
    path('auth/',views.CustomAuthToken.as_view()),
    path('auth/logout/',views.Logout.as_view()),
    path('auth/register/', views.RegisterView.as_view()),

    path('receipt_track/users/<userid>/', views.getReceiptsByUser),
    path('receipt_track/<receiptid>/', views.singleReceipt),
    path('receipt_track/', views.postReceipt),

    path('spend_history/<user_id>/', views.getSpendHistory),
    path('spend_history/<user_id>/<category_id>/', views.getSpendHistory),

    path('income_history/<user_id>/', views.getIncomeHistory),
    path('income_history/<user_id>/<category_id>/', views.getIncomeHistory),

    path('savings_history/<user_id>/', views.getSavingsHistory),

    #path('budget/<budgetid>/', views.manageBudget),
    path('budget/users/<userid>/', views.manageUserBudget),
    path('budget/', views.setInitialBudget),

    path('receipt_upload/<userid>/', views.ReceiptUploadConvertViewSet.as_view()),
    
    path('validate_challenge/<userid>/<challengeid>', views.ValidateChallengeViewSet.as_view()),
    
    path('badges_earned/<userid>/', views.BadgesEarnedViewSet.as_view()),

    path('', include(router.urls))
]


from app import tasks

# Create a separate thread to execute tasks on timer
#t1 = tasks.gameThread(5)

# Start the game logic thread:

#t1.start()

