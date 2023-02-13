from storages.backends.gcloud import GoogleCloudStorage
from django.db import models
from django.contrib.auth import get_user_model
import uuid

# Create your models here.
storage = GoogleCloudStorage()
User = get_user_model()

def user_directory_path(*_):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'labeled/{uuid.uuid4()}'

class LabeledImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=100, default="image_name")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='labeled_images')
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.FileField(upload_to=user_directory_path)
    
    def __str__(self):
        return self.name

    class Meta:
        db_table = "upload"
        ordering = ['-created_at']
