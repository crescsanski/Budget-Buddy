from django.contrib import admin
admin.autodiscover()
from django.conf.urls import include, url
from django.views.generic.base import TemplateView
from django.urls import path

urlpatterns = [  
    path('api/', include('app.urls', namespace="app")),
    path('', TemplateView.as_view(template_name="home.html"), name="home"),
    path('admin/', admin.site.urls),
]




