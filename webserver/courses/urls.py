from django.urls import path
from courses.views import create_course, get_course_info, list_courses, join_course

urlpatterns = [
    path('create', create_course),
    path('get/<int:id>', get_course_info),
    path('list', list_courses),
    path('join', join_course),
]
