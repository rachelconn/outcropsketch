import os
import subprocess

from celery import shared_task
from django.conf import settings

from uploads.models import LabeledImage, StudentAnnotation

@shared_task
def evaluate_annotation(labeled_image_id, annotation_id):
    # Fetch objects by id from DB
    labeled_image = LabeledImage.objects.get(id=labeled_image_id)
    annotation = StudentAnnotation.objects.get(id=annotation_id)

    # Get annotation URLs to compare
    original_image_url = labeled_image.json_file.url
    annotation_url = annotation.annotation.url

    # Run ts-node process that returns accuracy
    os.chdir(settings.PROJECT_ROOT)
    command = f'ts-node src/utils/getEvaluation.ts "{original_image_url}" "{annotation_url}"'
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    stdout, stderr = process.communicate()
    unexpected_errors = stderr.decode('utf-8').rstrip().split('\n')[1:] # Expected error: No reducer provided for key "undoHistory"

    if unexpected_errors:
        raise OSError('Unexpected error while calculating accuracy.')

    # Update accuracy in DB
    accuracy = float(stdout.decode('utf-8').rstrip())
    StudentAnnotation.objects.filter(id=annotation.id).update(accuracy=accuracy)
