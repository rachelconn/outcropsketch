# Generated by Django 4.1.3 on 2023-01-23 21:32

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('uploads', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='LabelFile',
            new_name='FileUpload',
        ),
    ]
