from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.shortcuts import render
from rest_framework import serializers
from .models import FileUpload

# from django.db import IntegrityError
# from django.contrib.auth import get_user_model, authenticate, login as django_login, logout as django_logout

# Create your views here.

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ('file', )

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload(request):
    if request.method == 'POST':
        file_serializer = FileUploadSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# from django.shortcuts import render
# from django.conf import settings
# from django.core.files.storage import FileSystemStorage

# def simple_upload(request):
#     if request.method == 'POST' and request.FILES['myfile']:
#         myfile = request.FILES['myfile']
#         fs = FileSystemStorage()
#         filename = fs.save(myfile.name, myfile)
#         uploaded_file_url = fs.url(filename)
#         return render(request, 'core/simple_upload.html', {
#             'uploaded_file_url': uploaded_file_url
#         })
#     return render(request, 'core/simple_upload.html')

