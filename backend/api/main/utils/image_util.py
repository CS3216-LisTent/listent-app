import io
from PIL import Image


def process_image(image_file, buffer):
    image = Image.open(image_file)
    # max width, max height
    max_size = 2560, 2560
    # downscale if width > max width or height > max height while maintaining aspect ratio
    image.thumbnail(max_size, Image.LANCZOS)
    image.save(buffer, format=image.format)
    buffer.seek(0)
    # return image_buffer
