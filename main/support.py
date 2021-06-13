from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.translation.trans_null import gettext_lazy as _

from main.diplomas_generator import generate_image
from main.forms import GeneratedDiplomasForm


def generate_img(request, text, is_path):
    d = request.GET

    print(text)

    img = generate_image(d.get('image'), text, d.get('x'), d.get('y'), d.get('bold'), d.get('size'),
                         d.get('color'))
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
