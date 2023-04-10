"""outcropsketch URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
"""
from django.conf import settings
from django.urls import include, path, re_path
from django.views import static

urlpatterns = [
    re_path(r'^static/(?P<path>.*)$', static.serve, {
        'document_root': settings.PROJECT_ROOT / 'static',
    }),
    path('auth/', include('authentication.urls')),
    path('courses/', include('courses.urls')),
    path('', include('frontend.urls')),
]
