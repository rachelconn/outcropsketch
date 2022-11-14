from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.utils import timezone

class User(AbstractBaseUser):
    """ Custom user class containing more data """
    # Default fields
    email = models.EmailField(primary_key=True, max_length=255, blank=False)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    # Setting overrides
    USERNAME_FIELD = 'email'

    # Custom fields
    instructor = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
