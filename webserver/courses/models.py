from django.db import models
from authentication.models import User
from uploads.models import LabeledImage

from storages.backends.gcloud import GoogleCloudStorage
storage = GoogleCloudStorage()

# Create your models here.
class Course(models.Model):
    title = models.CharField(max_length=120)
    description = models.CharField(max_length=300, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_courses')
    students = models.ManyToManyField(User, related_name='joined_courses')
    images = models.ManyToManyField(LabeledImage, blank=True)


    def delete(self, *args, **kwargs):
        # Remove all linked image files when deleting Course object
        for image in self.images.all():
            storage.delete(image.image.name)
            image.delete()
        super().delete(*args, **kwargs)
