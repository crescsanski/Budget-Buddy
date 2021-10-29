from django.conf.urls import include, url
from django.urls import path
from django.db.models import base
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter

from app import views
from rest_framework.authtoken import views as authViews

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', views.UsersViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
urlpatterns = [
    path('api/auth/',views.CustomAuthToken.as_view()),
    path('api/auth/register/', views.RegisterView.as_view()),
    path('api/', include(router.urls)),
]