from django.urls import path
from courses.views import (
    add_image_to_course,
    create_course,
    get_course_info,
    list_courses,
    join_course,
)

urlpatterns = [
    path('create', create_course),
    path('get/<int:id>', get_course_info),
    path('list', list_courses),
    path('join', join_course),
    path('add_image/<int:id>', add_image_to_course),
]
