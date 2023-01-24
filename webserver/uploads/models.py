from django.db import models
from authentication.models import User

# Create your models here.

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'labels_{instance.user.id}_%Y%m%d%H%M%S%f'

class FileUpload(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_directory_path)
 
    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']



