import io
import json
import zipfile

from PIL import Image
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.translation.trans_null import gettext_lazy as _

from main.models import DiplomaTemplate, ExcelForGenerate, ZipFile
from main.serializers import DiplomaSerializer
from .support import *

from openpyxl import load_workbook

# TODO: add authentication

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
        'message': _('Templates were returned.'),
        'templates': DiplomaSerializer(templates, many=True).data
    })


def upload_templates(request):
    if request.method == 'POST':
        f = request.FILES
        dp = DiplomaTemplate.objects.create(diploma=f.get('file'))
        try:
            dp.save()
        except Exception as e:
            return JsonResponse({'result': False, 'message': _(e.__str__())})
        return JsonResponse({'result': True, 'message': _('Template was saved.'), 'url': dp.diploma.url, 'id': dp.id})

    elif request.method == 'DELETE':
        id = request.POST.get('id')
        dp = DiplomaTemplate.objects.get(pk=id)
        dp.delete()
        return JsonResponse({'result': True, 'message': _('Template delete successful.')})

    return JsonResponse({'result': False, 'message': _('Method not allowed.')})


def generate_diploma(request):
    if request.method == 'GET':
        names = json.loads(request.GET.get('names'))
        if len(names) > 1:
            buffer = io.BytesIO()
            zip_file = zipfile.ZipFile(buffer, 'w')

            for i in names:
                b = io.BytesIO()

                path = generate_img(request, i, True)
                image = Image.open(path)
                image.save(b, format='PNG')

                b.seek(0)

                zip_file.writestr(path.split('\\')[-1], b.read())

            zip_file.close()

            f = ZipFile.objects.create(file=InMemoryUploadedFile(buffer, None, "TestZip.zip", 'application/zip', buffer.tell, None))
            f.save()

            return JsonResponse({'result': True, 'message': 'True', 'url': f.file.url})
        url = generate_img(request, json.loads(request.GET.get('names'))[0], False)
        return JsonResponse({
            'result': True,
            'message': _('Images was generated.'),
            'url': url
        })

    elif request.method == 'POST':
        names = []

        excel = ExcelForGenerate(file=request.FILES.get('file'))
        try:
            excel.save()
        except Exception as e:
            return JsonResponse({
                'result': False,
                'message': _('Something was wrong... Please, try again'),
                'errors': e.__str__(),
            })

        wb_obj = load_workbook(excel.file.path)

        sheet_obj = wb_obj.active

        max_row = sheet_obj.max_row

        for i in range(2, max_row + 1):
            cell = sheet_obj.cell(i, 1)
            names.append(cell.value)

        return JsonResponse({
            'result': True,
            'message': _('Diplomas generated.'),
            'names': names,
        })
