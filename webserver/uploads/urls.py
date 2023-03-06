from django.urls import path
from uploads.views import upload

urlpatterns = [
    path('upload', upload)
]
