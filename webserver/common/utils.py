from base64 import b64decode
from io import BytesIO

from django.core.files.images import ImageFile
from PIL import Image

def create_thumbnail(base64_string: str, filename: str) -> ImageFile:
    """ Converts a base-64 encoded image to a scaled-down thumbnail """
    decoded = b64decode(base64_string.split(',', 1)[1])
    raw_image = BytesIO(decoded)
    with Image.open(raw_image) as image:
        image.thumbnail((256, 256))
        image_data = BytesIO()
        image.save(image_data, 'JPEG')
        output_filename = f'{filename.rsplit(",", 1)[0]}.jpg'
        return ImageFile(image_data, output_filename)
