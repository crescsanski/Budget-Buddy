from django.contrib import admin
admin.autodiscover()
from django.conf.urls import include, url
from django.views.generic.base import TemplateView, RedirectView
from django.urls import path, re_path

urlpatterns = [  
    re_path(r"^api/", include("app.urls", namespace="app")),
    re_path(r"^api$", RedirectView.as_view(url="/app/")),
    re_path(r"^admin/", admin.site.urls),
    re_path(r"^admin$", RedirectView.as_view(url="/admin/")),

    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]




