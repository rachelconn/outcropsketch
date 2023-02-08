from django.urls import path
from courses.views import create_course, join_course

urlpatterns = [
    path('create', create_course),
    path('join', join_course),
]
