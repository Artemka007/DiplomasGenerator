import io
import json
import zipfile

from diplomasgenerator.serializer import (FailResponseSerializer,
                                          ResponseSerializer,
                                          UnauthorizedResponseSerializer)
from django.http import JsonResponse
from django.utils.translation.trans_null import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from openpyxl import load_workbook
from PIL import Image
from rest_framework import parsers
from rest_framework.generics import GenericAPIView
from rest_framework.views import Response

from generator.models import DiplomaTemplate, ExcelForGenerate, ZipFile
from generator.responses import (DiplomaUploadSuccessResponseSerializer,
                                 GetDiplomaTemplateSuccessResponse)
from generator.serializers import DiplomaTemplateSerializer

from .apidocs import *
from .utils import *


class DiplomaTemplates(GenericAPIView):
    queryset = DiplomaTemplate.objects.all()
    serializer_class = DiplomaTemplateSerializer
    parser_classes = (parsers.MultiPartParser,)
    
    @swagger_auto_schema(
        responses={
            200: GetDiplomaTemplateSuccessResponse,
            401: UnauthorizedResponseSerializer,
            500: FailResponseSerializer
        }
    )
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({
                'result': False, 
                'message': _('User is not authenticated.')
            }, 401)
        templates = self.get_queryset()
        return Response({
            'result': True,
            'message': _('Templates were returned.'),
            'templates': DiplomaTemplateSerializer(templates, many=True).data
        })

    @swagger_auto_schema(
        manual_parameters=upload_template_formdata_parametrs, 
        responses={
            200: DiplomaUploadSuccessResponseSerializer, 
            401: UnauthorizedResponseSerializer,
            500: FailResponseSerializer
        }
    )
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({
                'result': False, 
                'message': _('User is not authenticated.')
            }, 401)
        template_file = request.FILES.get('file')
        template_obj = DiplomaTemplate.objects.create(src=template_file)
        try:
            template_obj.save()
        except Exception as e:
            return Response({
                'result': False, 
                'message': _(e.__str__())
            }, 500)
        return Response({
            'result': True, 
            'message': _('Template was saved.'), 
            'url': template_obj.diploma.url, 
            'id': template_obj.id
        })

    @swagger_auto_schema(
        manual_parameters=delete_template_query_parametrs,
        response={
            200: ResponseSerializer,
            401: UnauthorizedResponseSerializer,
            500: FailResponseSerializer
        }
    )
    def delete(self, request):
        if not request.user.is_authenticated:
            return Response({
                'result': False, 
                'message': _('User is not authenticated.')
            }, 401)
        id = request.POST.get('id')
        try:
            dp = DiplomaTemplate.objects.get(pk=id)
        except Exception as e:
            return Response({
                'result': False, 
                'message': _(e.__str__())
            }, 500)
        dp.delete()
        return Response({'result': True, 'message': _('Template delete successful.')})


def generate_diploma(request):
    '''
    View-функция для генерации грамот
    '''
    if request.method == 'GET':
        # получяем массив с именами учеников
        names = json.loads(request.GET.get('names'))

        # Если длинна массива равна одному, значит пришел запрос на тестовую грамоту, следовательно zip-файла создавать не нужно
        if len(names) <= 1:
            url = generate_image_object(request.GET, names[0], False)
            return JsonResponse({
                'result': True,
                'message': _('Images was generated.'),
                'url': url
            })
        
        buffer = io.BytesIO()
        zip_file = zipfile.ZipFile(buffer, 'w')

        for i in names:
            b = io.BytesIO()

            path = generate_image_object(request.GET, i, True)
            image = Image.open(path)
            image.save(b, format='JPEG')

            b.seek(0)

            zip_file.writestr(path.split('\\')[-1], b.read())

        zip_file.close()

        f = ZipFile.objects.create(file=InMemoryUploadedFile(buffer, None, "TestZip.zip", 'application/zip', buffer.tell, None))
        f.save()

        return JsonResponse({'result': True, 'message': _('Images has been generated.'), 'url': f.file.url})

def get_names(request):
    if request.method == 'POST':
        names = []

        excel = ExcelForGenerate(file=request.FILES.get('file'))
        try:
            excel.save()
        except Exception as e:
            return JsonResponse({
                'result': False,
                'message': _(e.__str__()),
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
