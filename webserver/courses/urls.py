from django.urls import path
from courses.views import create_course, list_courses, join_course

urlpatterns = [
    path('create', create_course),
    path('list', list_courses),
    path('join', join_course),
]
