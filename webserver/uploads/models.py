from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
import uuid

# Create your models here.
User = get_user_model()

def json_file_path(*_):
    return f'labeled/json/{uuid.uuid4()}.json'

def thumbnail_path(*_):
    return f'labeled/thumbs/{uuid.uuid4()}.jpg'

class LabeledImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=100, default="image_name")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='labeled_images')
    created_at = models.DateTimeField(auto_now_add=True)
    json_file = models.FileField(upload_to=json_file_path)
    thumbnail = models.ImageField(upload_to=thumbnail_path)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'labeled_image'
        ordering = ['-created_at']
