from storages.backends.gcloud import GoogleCloudStorage
from django.db import models
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

# Create your models here.
storage = GoogleCloudStorage()
User = get_user_model()

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'labels_{instance.user.id}_%Y%m%d%H%M%S%f'

class FileManager(models.Manager):
    use_in_migrations = True

    def upload_file(self, *_, image, name, **extra_fields):
        img = self.model(
            image = image,
            name = name,
            **extra_fields,
        )
        img.save(using=self._db)
        return img
class File(models.Model):
    name = models.CharField(max_length=100, default="image_name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='images/')  
    
    objects = FileManager()
  
    def __str__(self):
        return self.name

    class Meta:
        db_table = "upload"
        ordering = ['-created_at']
