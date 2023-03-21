from rest_framework import serializers
from .models import LabeledImage, StudentAnnotation

class LabeledImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabeledImage
        fields = ('id', 'name', 'created_at', 'json_file', 'thumbnail')

class StudentAnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnnotation
        fields = ('id', 'owner.first_name', 'owner.last_name', 'created_at')
