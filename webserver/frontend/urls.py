from django.urls import re_path
from . import views

urlpatterns = [
    # Resolve requests to index page by default
    re_path('.*', views.index),
]
