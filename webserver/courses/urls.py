from django.urls import path
from courses.views import (
    add_image_to_course,
    create_course,
    delete_image,
    get_course_info,
    get_annotation,
    get_image_data,
    get_user_annotation,
    list_courses,
    list_student_annotations,
    join_course,
    submit_student_labeled_image,
    update_labeled_image_json,
)

urlpatterns = [
    # Courses
    path('create', create_course),
    path('get/<int:id>', get_course_info),
    path('list', list_courses),
    path('join', join_course),
    # Labeled images
    path('add_image/<int:id>', add_image_to_course),
    path('delete_image/<slug:id>', delete_image),
    path('update_image/<slug:id>', update_labeled_image_json),
    path('get_image_data/<slug:id>', get_image_data),
    # Annotations
    path('<int:course_id>/submit_annotation/<slug:image_id>', submit_student_labeled_image),
    path('get_annotation/<slug:id>', get_annotation),
    path('user_annotation/<slug:id>', get_user_annotation),
    path('list_annotations/<slug:id>', list_student_annotations),
]
