from itertools import chain
import json

from django.conf import settings
from django.db.models import Max
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from common.response import ErrorResponse
from common.utils import create_thumbnail
from courses.models import Course
from uploads.models import LabeledImage
from uploads.serializers import LabeledImageSerializer

# Create your views here.
@api_view(['POST'])
def create_course(request):
    # Error handling
    # TODO: does this work as intended?
    if request.user.is_anonymous:
        return ErrorResponse('You must be logged in to create a course.')
    if not request.user.instructor:
        return ErrorResponse('Only instructors can create courses.')
    if 'title' not in request.data:
        return ErrorResponse('You must provide a title to create a course.')

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
        return ErrorResponse('You must be logged in to join a course.')
    if 'id' not in request.data:
        return ErrorResponse('Course ID not specified')
    try:
        course_id = int(request.data['id'])
    except ValueError:
        return ErrorResponse('Course code must be a number.')

    try:
        course_to_join = Course.objects.get(id=request.data['id'])
        course_to_join.students.add(request.user)
    except Course.DoesNotExist:
        return ErrorResponse('No course with the provided code was found. Please make sure you entered it correctly.')

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
        return ErrorResponse('You must be logged in to view your courses.')
    serialized_courses = [serialize_course(course, user) for course in chain(user.owned_courses.all(), user.joined_courses.all())]
    return Response(data=serialized_courses)

@api_view(['GET'])
def get_course_info(request, id):
    try:
        requested_course = Course.objects.get(id=id)
        return Response(data=serialize_course(requested_course, request.user))

    except Course.DoesNotExist:
        return ErrorResponse('The requested course does not exist.')

@api_view(['POST'])
def add_image_to_course(request, id):
    if request.user.is_anonymous:
        return Response('You must be logged in to join a course.')
    label_file = request.FILES.get('image')

    if label_file == None:
        return ErrorResponse('A .json label file is required.')

    if label_file.size > 16_000_000:
        return ErrorResponse('Uploaded file exceeds max size of 16MB.')

    try:
        label_file_json = json.load(label_file)
    except json.JSONDecodeError:
        return ErrorResponse('Uploaded file is not a well-formatted .json file.')

    required_fields = ['image', 'imageName', 'project', 'version']
    if any(field not in label_file_json for field in required_fields):
        return ErrorResponse('Uploaded .json file was not created by OutcropSketch.')

    if label_file_json['version'] != settings.CURRENT_LABEL_FILE_VERSION:
        return ErrorResponse('Uploaded .json file was created using an incompatible version of OutcropSketch.')

    thumbnail = create_thumbnail(label_file_json['image'], label_file_json['imageName'])

    try:
        course = Course.objects.get(id=id)
        labeled_image = LabeledImage.objects.create(
            name=label_file.name,
            owner=request.user,
            json_file=label_file,
            thumbnail=thumbnail,
        )
        course.images.add(labeled_image)
    except Course.DoesNotExist:
        return ErrorResponse('No course with the provided code was found. Please make sure you entered it correctly.')
    return Response()

@api_view(['GET'])
def get_course_images(request, id):
    user = request.user
    if user.is_anonymous:
        return Response('You must be logged in to view your courses.')
    try:
        course = Course.objects.get(id=id)
        # Sort images by creation date to give a consistent and sequential ordering
        images = course.images.all().order_by('created_at')
        serializer = LabeledImageSerializer(images, many=True)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return ErrorResponse('The requested course does not exist.')
