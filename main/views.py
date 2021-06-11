from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _

from main.diplomas_generator import generate_image
from main.forms import GeneratedDiplomasForm
from main.models import DiplomaTemplate, GeneratedDiplomas
from main.serializers import DiplomaSerializer


def index(request):
    return render(request, 'index.html')


def editor(request):
    return render(request, 'diploma_editor.html')


def get_diplomas_templates(request):
    # TODO: create authenticated
    # if not request.user.is_authenticated:
    #     return JsonResponse({'result': False, 'message': _('User is not authenticated.')})

    templates = DiplomaTemplate.objects.all()
    return JsonResponse({
        'result': True,
        'message': _('Templates returned.'),
        'templates': DiplomaSerializer(templates, many=True).data
    })


def generate_diploma(request):
    if request.method == 'GET':
        d = request.GET
        img = generate_image(d.get('image'), d.get('text'), d.get('x'), d.get('y'), d.get('bold'), d.get('size'),
                             d.get('color'))
        diploma = GeneratedDiplomasForm()
        diploma.generated_diploma = img
        diploma.instance.generated_diploma.save(img.name, InMemoryUploadedFile(
            img,
            None,
            img.name,
            'image/*',
            img.tell,
            None
        ))
        if diploma.is_valid():
            diploma.save()
            return JsonResponse({
                'result': True,
                'message': _('Image was returned.'),
                'url': diploma.instance.generated_diploma
            })
        else:
            return JsonResponse({
                'result': True,
                'message': _('Image was returned.'),
                'url': diploma.instance.generated_diploma.url
            })
