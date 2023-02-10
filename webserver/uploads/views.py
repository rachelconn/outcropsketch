from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .models import File

@api_view(['POST'])
def upload(request):
    img_params = {}
    required_field = 'image'
    if required_field not in request.data:
        return Response(
            data={
                'reason': f"Required field {required_field.replace('_', ' ')} missing from request.",
            },
            status=400,
        )
    img_params[required_field] = request.data[required_field]
    img_params['name'] = request.data[required_field].name

    try:
        img = File.objects.upload_file(
            **img_params,
        )
        return Response()
    except Exception as e:
        return Response(
            data={
                'reason': "Unable to upload the file. Try again later.",
            },
            status=400,
        )

