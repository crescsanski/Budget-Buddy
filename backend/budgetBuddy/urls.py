from django.contrib import admin
admin.autodiscover()
from django.conf.urls import include, url
from django.views.generic.base import TemplateView
from django.urls import path, re_path

urlpatterns = [  
    path('api/', include('app.urls', namespace="app")),
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
    path('admin/', admin.site.urls),
]




