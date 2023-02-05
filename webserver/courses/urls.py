from django.urls import path
from courses.views import create_course

urlpatterns = [
    path('create', create_course),
]
