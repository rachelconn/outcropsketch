# Generated by Django 4.1.3 on 2023-03-20 23:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uploads.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_remove_course_images'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('uploads', '0002_remove_labeledimage_image_labeledimage_json_file_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='labeledimage',
            name='course',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='labeled_images', to='courses.course'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='StudentAnnotation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('annotation', models.FileField(upload_to=uploads.models.annotation_path)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('labeled_image', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='annotations', to='uploads.labeledimage')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='annotations', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'student_annotation',
            },
        ),
        migrations.AddConstraint(
            model_name='studentannotation',
            constraint=models.UniqueConstraint(fields=('owner', 'labeled_image'), name='annotation by user'),
        ),
    ]
