from itertools import chain

from django.db.models import Max
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from courses.models import Course

# Create your views here.
@api_view(['POST'])
def create_course(request):
    # Error handling
    # TODO: does this work as intended?
    if request.user.is_anonymous:
        return Response(
            data=dict(
                reason='You must be logged in to create a course.',
            ),
            status=400,
        )
    if not request.user.instructor:
        return Response(
            data=dict(
                reason='Only instructors can create courses.',
            ),
            status=400,
        )
    if 'title' not in request.data:
        return Response(
            data=dict(
                reason='You must provide a title to create a course.',
            ),
            status=400,
        )

    # Request valid, generate ID (sequential starting from 100,000)
    max_course_id = Course.objects.aggregate(Max('id'))['id__max']
    new_id = 100_000 if max_course_id is None else max_course_id + 1

    # Create course object
    course = Course.objects.create(
        id=new_id,
        title=request.data['title'],
        description=request.data.get('description', ''),
        owner=request.user,
    )
    return Response()

@api_view(['POST'])
def join_course(request):
    if request.user.is_anonymous:
        return Response(
            data=dict(
                reason='You must be logged in to join a course.',
            ),
            status=400,
        )
    if 'id' not in request.data:
        return Response(
            data=dict(
                reason='Course ID not specified',
            ),
            status=400,
        )
    try:
        course_id = int(request.data['id'])
    except ValueError:
        return Response(
            data=dict(
                reason='Course code must be a number.',
            ),
            status=400,
        )

    try:
        course_to_join = Course.objects.get(id=request.data['id'])
        course_to_join.students.add(request.user)
    except Course.DoesNotExist:
        return Response(
            data=dict(
                reason='No course with the provided code was found. Please make sure you entered it correctly.',
            ),
            status=400,
        )

    return Response()

def serialize_course(course, user):
    """ Helper for list_courses view to serialize a single course """
    return dict(
        courseCode=course.id,
        description=course.description,
        title=course.title,
        owner=course.owner == user,
    )

# TODO: create view for listing owned and enrolled courses
@api_view(['GET'])
def list_courses(request):
    user = request.user
    if user.is_anonymous:
        return Response(
            data=dict(
                reason='You must be logged in to view your courses.',
            ),
            status=400,
        )
    serialized_courses = [serialize_course(course, user) for course in chain(user.owned_courses.all(), user.joined_courses.all())]
    return Response(data=serialized_courses)

@api_view(['GET'])
def get_course_info(request, id):
    try:
        requested_course = Course.objects.get(id=id)
        return Response(data=serialize_course(requested_course, request.user))

    except Course.DoesNotExist:
        return Response(
            data=dict(
                reason='The requested course does not exist.',
            ),
            status=400,
        )
