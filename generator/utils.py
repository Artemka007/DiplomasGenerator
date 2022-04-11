import io
import os.path
import random
import string
from typing import Dict, Union

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.translation.trans_null import gettext_lazy as _
from PIL import Image, ImageDraw, ImageFont

from generator.forms import DiplomaForm
from generator.serializers import DipomaSerializer


def url_to_image(url: str):
    """
    Функция для открытия изображения по url.
    
    Args:
        url (str): url грамоты

    Returns:
        (BufferedReader): файл изображения
    """

    # т.к. с фронта приходит url изображения, то его необходимо преобразовать в путь к изображению на компьютере
    path = url.split("/media/")[1]
    file = open(f'./media/{path}', 'rb')
    return file


def generate_byte_image(template: str, text: str, x: str, y: str, font_style: Union[str, None], font_size: str, foreground: str):
    """
    Генерация изображения грамоты в битовом формате.

    Args:
        template (str): url шаблона грамоты
        text (str): имя и фамилия ученика, для которого генерируется грамота
        x (str): середина двух крайних координат по оси x
        y (str): координата по оси y
        font_style (Union[str, None]): стиль шрифта (italic | bold | bolditalic)
        font_size (str): размер шрифта
        foreground (str): цвет шрифта

    Returns:
        (ContentFile[bytes]): изображение грамоты
    """

    text_coordinates = (float(x), float(y))
    font_family = 'fonts/Arial/Arial.ttf'

    if font_style == 'italic':
        font_family = 'fonts/Arial/Arial-Italic.ttf'

    elif font_style == 'bold':
        font_family = 'fonts/Arial/Arial-Bold.ttf'
    
    elif font_style == 'bolditalic':
        font_family = 'fonts/Arial/Arial-BoldItalic.ttf'
    
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

    image_name = f'GeneratedDiploma_{template.split("/")[-1].split(".")[0]}_{ran}.png'
    new_image = ContentFile(image_io.getvalue(), name=image_name)

    return new_image

def generate_diploma_object(data: Dict[str, str], text: str, is_path: bool) -> str:
    """
    Генерация грамот по параметрам.

    Args:
        data (Dict[str, str]): параметры для генерации грамоты
        text (str): текст для записи на грамоту по координатам
        is_path (bool): вернуть путь к грамоте или url грамоты

    Returns:
        (str): url или путь к файлу грамоты
    """
    img = generate_byte_image(data.get('template_url'), text, data.get('x'), data.get('y'), data.get('font_style'), data.get('font_size', '24'),
                         data.get('foreground', '#000000'))
    
    template_id = data.get("template_id")
    template_src = InMemoryUploadedFile(
        img,
        None,
        img.name,
        'image/*',
        img.tell,
        None
    )

    if template_id is not None:
        serializer = DipomaSerializer(data={"temp": int(template_id), "src": template_src})
    else:
        serializer = DipomaSerializer(data={"src": template_src})
    
    serializer.is_valid(raise_exception=True)
    serializer.save()

    if is_path:
        return serializer.instance.src.path
    else:
        return serializer.instance.src.url
