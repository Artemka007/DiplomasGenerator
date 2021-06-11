import io
import os.path

import cv2 as cv
import urllib.request

from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
from django.core.files import File
from django.core.files.base import ContentFile


def url_to_image(url):
    return io.BytesIO(urllib.request.urlopen(url).read())


def generate_image(image, text, x, y, bold, scale, color):
    path = url_to_image(image)

    img = Image.open(path)

    f = 'fonts/Roboto-Regular.ttf'

    if bold == 'italic':
        f = 'fonts/Roboto-Italic.ttf'

    elif bold == 'bold':
        f = 'fonts/Roboto-Bold.ttf'

    font = ImageFont.truetype(os.path.join(settings.STATICFILES_DIRS[0], f), size=int(scale))

    draw = ImageDraw.Draw(img)
    draw.text((int(x), int(y)), text, font=font, fill=color, align='center')

    im = io.BytesIO()

    img.save(im, img.format)

    new_image = ContentFile(im.getvalue(), name='GeneratedDiploma_' + image.split('/')[-1].split('.')[0] + '_' + text + '.jpg')

    print(new_image)

    return new_image
