from itertools import chain
import json

import celery
from django.conf import settings
from django.core.files.base import ContentFile
from django.db.models import Max
from django.http import HttpResponseRedirect
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from common.response import ErrorResponse
from common.utils import create_thumbnail
from courses.models import Course
from courses.tasks import evaluate_annotation
from uploads.models import LabeledImage, StudentAnnotation
from uploads.serializers import LabeledImageSerializer, StudentAnnotationSerializer

# Create your views here.
@api_view(['POST'])
def create_course(request):
    # Error handling
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
    Course.objects.create(
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

def serialize_course(course, user, include_images=False):
    """ Helper for list_courses and get_course_info views to serialize a single course """
    serialized_course = dict(
        courseCode=course.id,
        description=course.description,
        title=course.title,
        owner=course.owner == user,
    )
    if include_images:
        images = course.labeled_images.all().order_by('created_at')
        serialized_course['labeledImages'] = LabeledImageSerializer(images, many=True).data

    return serialized_course

@api_view(['GET'])
def list_courses(request):
    user = request.user
    if user.is_anonymous:
        return ErrorResponse('You must be logged in to view your courses.')
    serialized_courses = [serialize_course(course, user) for course in chain(user.owned_courses.all(), user.joined_courses.all())]
    return Response(data=serialized_courses)

@api_view(['GET'])
def get_course_info(request, id):
    if request.user.is_anonymous:
        return ErrorResponse('You must be logged in to get information for a course.')
    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return ErrorResponse('The requested course does not exist.')

    if request.user != course.owner and not course.students.all().filter(email=request.user.email).exists():
        return ErrorResponse('You do not have permission to access this course.')

    return Response(data=serialize_course(course, request.user, True))

def validate_label_file(file, is_string=False):
    """
    Helper function that returns the parsed json if the label file is valid,
    otherwise raises an ErrorResponse object with the reason it's not valid.
    """
    if file == None:
        raise ErrorResponse('A .json label file is required.')

    file_size = len(file) if is_string else file.size
    if file_size > 16_000_000:
        raise ErrorResponse('Uploaded file exceeds max size of 16MB.')

    try:
        if is_string:
            label_file_json = json.loads(file)
        else:
            label_file_json = json.load(file)
    except json.JSONDecodeError:
        raise ErrorResponse('Uploaded file is not a well-formatted .json file.')

    required_fields = ['image', 'imageName', 'project', 'version']
    if any(field not in label_file_json for field in required_fields):
        raise ErrorResponse('Uploaded .json file was not created by OutcropSketch.')

    if label_file_json['version'] != settings.CURRENT_LABEL_FILE_VERSION:
        raise ErrorResponse('Uploaded .json file was created using an incompatible version of OutcropSketch.')

    return label_file_json


@api_view(['POST'])
def add_image_to_course(request, id):
    if request.user.is_anonymous:
        return Response('You must be logged in to add an image to a course.')

    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return ErrorResponse('No course with the provided code was found. Please make sure you entered it correctly.')

    if course.owner != request.user:
        return ErrorResponse('Only the owner of a course can add images to it.')

    if 'title' not in request.data:
        return Response('No title was provided for the labeled image. Please provide a title.')
    title = request.data['title']

    label_file = request.FILES.get('image')

    try:
        label_file_json = validate_label_file(label_file)
    except ErrorResponse as response:
        return response

    thumbnail = create_thumbnail(label_file_json['image'], label_file_json['imageName'])

    labeled_image = LabeledImage.objects.create(
        course=course,
        name=title,
        owner=request.user,
        json_file=label_file,
        thumbnail=thumbnail,
    )
    course.labeled_images.add(labeled_image)
    return Response()

@api_view(['POST'])
def update_labeled_image_json(request, id):
    if request.user.is_anonymous:
        return Response('You must be logged in to update the labels for an image.')

    try:
        labeled_image = LabeledImage.objects.get(id=id)
    except LabeledImage.DoesNotExist:
        return ErrorResponse('No labeled image with the provided id was found. Please make sure you entered it correctly.')

    if labeled_image.owner != request.user:
        return ErrorResponse('Only the owner of an image can edit its labels.');

    label_file = request.data.get('image')

    try:
        validate_label_file(label_file, True)
    except ErrorResponse as response:
        return response

    new_json_file = ContentFile(label_file.encode('utf-8'))
    new_json_file.name = labeled_image.name

    labeled_image.json_file = new_json_file
    labeled_image.save()

    annotations = StudentAnnotation.objects.filter(labeled_image=labeled_image)

    # TODO: null all accuracies until done calculating
    evaluate_tasks = [evaluate_annotation.s(labeled_image.id, annotation.id) for annotation in annotations]
    evaluate_jobs = celery.group(evaluate_tasks)
    evaluate_jobs.apply_async()

    return Response()

@api_view(['GET'])
def get_image_data(request, id):
    """ Returns the labeled image data given a labeled image id """
    if request.user.is_anonymous:
        return Response('You must be logged in to get image data.')

    try:
        labeled_image = LabeledImage.objects.get(id=id)
    except LabeledImage.DoesNotExist:
        return ErrorResponse('No labeled image with the provided id was found. Please make sure you entered it correctly.')

    return HttpResponseRedirect(labeled_image.json_file.url)

@api_view(['DELETE'])
def delete_image(request, id):
    if request.user.is_anonymous:
        return ErrorResponse('You must be logged in to add an image to a course.')

    try:
        labeled_image = LabeledImage.objects.get(id=id)
    except LabeledImage.DoesNotExist:
        return ErrorResponse('No labeled image with the provided id was found. Please make sure you entered it correctly.')

    if labeled_image.owner != request.user:
        return ErrorResponse('Only the owner of a course can delete images from it.');

    labeled_image.delete()
    return Response()

@api_view(['GET'])
def get_annotation(request, id):
    """ Gets an annotation by its id """
    if request.user.is_anonymous:
        return Response('You must be logged in to view an annotation.')

    try:
        annotation = StudentAnnotation.objects.get(id=id)
    except StudentAnnotation.DoesNotExist:
        return ErrorResponse('No annotations exist with the provided id.')

    return HttpResponseRedirect(annotation.annotation.url)

@api_view(['GET'])
def get_user_annotation(request, id):
    """ Gets an annotation for the current user given a labeled image id """
    if request.user.is_anonymous:
        return Response('You must be logged in to create an annotation for an image.')

    try:
        labeled_image = LabeledImage.objects.get(id=id)
    except LabeledImage.DoesNotExist:
        return ErrorResponse('No labeled image with the provided id was found. Please make sure you entered it correctly.')

    if request.user == labeled_image.owner:
        return ErrorResponse('The owner of a labeled image cannot create an annotation for it.')

    try:
        annotation = StudentAnnotation.objects.get(labeled_image=labeled_image, owner=request.user)
    except StudentAnnotation.DoesNotExist:
        return Response('')

    return HttpResponseRedirect(annotation.annotation.url)

@api_view(['POST'])
def submit_student_labeled_image(request, course_id, image_id):
    if request.user.is_anonymous:
        return Response('You must be logged in to create an annotation for an image.')

    try:
        labeled_image = LabeledImage.objects.get(id=image_id)
    except LabeledImage.DoesNotExist:
        return ErrorResponse('No labeled image with the provided id was found. Please make sure you entered it correctly.')

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return ErrorResponse('No course with the provided id was found. Please make sure you entered it correctly.')

    if not course.labeled_images.filter(id=labeled_image.id).exists():
        return ErrorResponse('The labeled image provided does not belong to the given course. Please make sure you entered them correctly.')

    if not course.students.filter(email=request.user.email).exists():
        return ErrorResponse('Only students enrolled in a course may annotate images for it.')

    label_file = request.data.get('image')

    try:
        label_file_json = validate_label_file(label_file, True)
    except ErrorResponse as response:
        return response

    # Create virtual file containing project
    annotation_file = ContentFile(label_file_json['project'].encode('utf-8'))
    annotation_file.name = labeled_image.name

    # Save student's annotation
    annotation, _ = StudentAnnotation.objects.update_or_create(
        owner=request.user,
        labeled_image=labeled_image,
        defaults={
            'annotation': annotation_file,
        },
    )

    # Calculate accuracy by creating a Celery task
    evaluate_annotation.delay(labeled_image.id, annotation.id)

    return Response()

@api_view(['GET'])
def list_student_annotations(request, id):
    if request.user.is_anonymous:
        return ErrorResponse('You must be logged in to view annotations for a labeled image.')

    try:
        labeled_image = LabeledImage.objects.get(id=id)
    except LabeledImage.DoesNotExist:
        return ErrorResponse('No labeled image with the provided id was found. Please make sure you entered it correctly.')

    if request.user != labeled_image.owner:
        return ErrorResponse('Only the owner of a labeled image may view annotations for it.');

    annotations = StudentAnnotation.objects.filter(labeled_image=labeled_image)
    serialized_annotations = StudentAnnotationSerializer(annotations, many=True).data
    return Response(serialized_annotations)
