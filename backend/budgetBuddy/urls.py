from django.contrib import admin
admin.autodiscover()
from django.conf.urls import include, url
from django.urls import path

urlpatterns = [  
    path('api/', include('app.urls')),
    path('admin/', admin.site.urls),
]
