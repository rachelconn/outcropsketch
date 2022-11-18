from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, *_, email, first_name, last_name, password, student, instructor, researcher, **extra_fields):
        # Process input
        email = self.normalize_email(email)

        # Save user model
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            student=student,
            instructor=instructor,
            researcher=researcher,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    """ Custom user class containing more data """
    # Default fields
    email = models.EmailField(primary_key=True, max_length=255, blank=False)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    # Setting overrides
    USERNAME_FIELD = 'email'
    objects = UserManager()

    # Custom fields
    instructor = models.BooleanField()
    researcher = models.BooleanField()
    student = models.BooleanField()
    admin = models.BooleanField(default=False)
