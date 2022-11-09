"""outcropsketch URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
"""
from django.conf import settings
from django.urls import include, path, re_path
from django.views import static

urlpatterns = [
    # TODO: not sure if static paths are still resolved when debug = False, add a check before addingif they are
    re_path(r'^static/(?P<path>.*)$', static.serve, {
        'document_root': settings.BASE_DIR.parent / 'static',
    }),
    path('', include('frontend.urls')),
]
