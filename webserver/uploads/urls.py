from django.urls import path
from uploads.views import upload
# from uploads.views import image_request

# app_name = 'uploadapp'
# urlpatterns = [
#     path('image_upload', image_request, name="image_upload")
# ]

urlpatterns = [
    path('upload', upload)
]
