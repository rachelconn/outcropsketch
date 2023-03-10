from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

from common.response import ErrorResponse
from uploads.models import LabeledImage


@api_view(['POST'])
def upload(request):
    if request.user.is_anonymous:
        return ErrorResponse('You must be logged in to create a course.')
    if not request.data['image']:
        return ErrorResponse('An image is missing from request.')
    img = LabeledImage.objects.create(
        image = request.data['image'],
        name = request.data['image'].name,
        owner = request.user,
    )
    return Response()
