from rest_framework import serializers
from .models import LabeledImage

class LabeledImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabeledImage
        fields = ('id', 'name', 'owner', 'created_at', 'json_file', 'thumbnail')
