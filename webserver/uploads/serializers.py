from rest_framework import serializers
from .models import LabeledImage, StudentAnnotation

class LabeledImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabeledImage
        fields = ('id', 'name', 'created_at', 'json_file', 'thumbnail')

class StudentAnnotationSerializer(serializers.ModelSerializer):
    owner_first_name = serializers.CharField(source='owner.first_name')
    owner_last_name = serializers.CharField(source='owner.last_name')
    class Meta:
        model = StudentAnnotation
        fields = ('id', 'owner_first_name', 'owner_last_name', 'created_at')
