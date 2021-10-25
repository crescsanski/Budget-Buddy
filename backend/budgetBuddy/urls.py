"""budgetBuddy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import include, url
from django.urls import path
from rest_framework import routers
from app import views
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from budgetBuddy.views import CustomAuthToken
from rest_framework.authtoken import views as authViews


router = routers.DefaultRouter()
router.register(r'players', views.UsersViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # Additionally, we include login URLs for the browsable API.   
    url(r'^', include('app.urls')),
    # Wire up our API using automatic URL routing.
    path(r'api-token-auth/', CustomAuthToken.as_view())
]

