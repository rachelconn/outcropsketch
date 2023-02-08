from django.db import models
from authentication.models import User

# Create your models here.
class Course(models.Model):
    title = models.CharField(max_length=120)
    description = models.CharField(max_length=300, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='joined_courses')
