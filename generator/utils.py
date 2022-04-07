import io
import os.path
import random
import string
import urllib.request
from typing import Dict

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.translation.trans_null import gettext_lazy as _
from PIL import Image, ImageDraw, ImageFont

from generator.forms import GeneratedDiplomasForm


def url_to_image(url: str):
    '''
    Функция для открытия изображения по url.
    
    :param url

    :return - файл изображения
    '''

    # т.к. с фронта приходит url изображения, то его необходимо преобразовать в путь к изображению на компьютере
    path = url.split("/media/")[1]
    file = open(f'./media/{path}', 'rb')
    return file


def generate_byte_image(template: str, text: str, x: str, y: str, font_weight: str, font_size: str, foreground: str):
    '''
    Функция, которая генерирует изображение грамоты в битовом формате.

    :param template - url шаблона грамоты
    :param text - имя и фамилия ученика, для которого генерируется грамота
    :param x - середина двух крайних координат по оси x
    :param y - координата по оси y
    :param font_weight
    :param font_size
    :param foreground
    
    :return - изображение грамоты
    '''

    text_coordinates = (int(x), int(y))
    font_family = 'fonts/Arial/Arial.ttf'

    if font_weight == 'italic':
        font_family = 'fonts/Arial/Arial-Italic.ttf'

    elif font_weight == 'bold':
        font_family = 'fonts/Arial/Arial-Bold.ttf'
    
    font_path = os.path.join(settings.STATICFILES_DIRS[0], font_family)

    font = ImageFont.truetype(font=font_path, size=int(font_size))

    image_file = url_to_image(template)
    opened_image = Image.open(image_file)

    drawer = ImageDraw.Draw(opened_image)
    drawer.text(text_coordinates, text, font=font, fill=foreground, align='center')

    image_io = io.BytesIO()
    opened_image.save(image_io, opened_image.format)

    # рандомная последовательность букв и цифр для названия изображения
    ran = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

    image_name = f'GeneratedDiploma_{template.split("/")[-1].split(".")[0]}_{ran}.jpg'
    new_image = ContentFile(image_io.getvalue(), name=image_name)

    return new_image

def generate_image_object(data: Dict[str, str], text: str, is_path: bool) -> str:
    '''
    Функция, которая генерирует объект грамоты и сохраняет его в базе данных.
    
    :param data - данные в POST-запросе
    :param text - имя и фамилия ученика, для которого генерируется грамота
    :param is_path - флаг, который показывает, вернуть путь к файлу грамоты, или вернуть ее url
    
    :return - путь к файлу грамоты или url грамоты
    '''
    img = generate_byte_image(data.get('template'), text, data.get('x'), data.get('y'), data.get('font_weight'), data.get('font_size'),
                         data.get('foreground'))
    diploma = GeneratedDiplomasForm()
    diploma.instance.generated_diploma.save(img.name, InMemoryUploadedFile(
        img,
        None,
        img.name,
        'image/*',
        img.tell,
        None
    ))
    if is_path:
        return diploma.instance.generated_diploma.path
    else:
        return diploma.instance.generated_diploma.url
