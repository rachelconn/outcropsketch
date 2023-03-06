from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .models import LabeledImage


@api_view(['POST'])
def upload(request):
    if request.user.is_anonymous:
        return Response(
            data=dict(
                reason='You must be logged in to create a course.',
            ),
            status=400,
        )
    if not request.data['image']:
        return Response(
            data={
                'reason: an image is missing from request.',
            },
            status=400,
        )
    img = LabeledImage.objects.create(
        image = request.data['image'],
        name = request.data['image'].name,
        owner = request.user,
    )
    return Response(
    )
    