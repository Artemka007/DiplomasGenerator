import io
import json
import zipfile

from diplomasgenerator.responses import (FailResponseSerializer,
                                         ResponseSerializer,
                                         UnauthorizedResponseSerializer)
from django.utils.translation.trans_null import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from openpyxl import load_workbook
from PIL import Image
from rest_framework import parsers
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from rest_framework.views import Response

from generator.models import Diploma, DiplomaTemplate, ZipFile
from generator.requests import GenerateDiplomaRequestSerializer
from generator.responses import (
    AnaliticsResponseSerializer, GenerateDiplomaResponseSerializer,
    GetDiplomaTemplateSuccessResponse,
    UploadDiplomaTemlplateSuccessResponseSerializer)
from generator.serializers import DiplomaTemplateSerializer

from .apidocs import *
from .utils import *


class DiplomaTemplates(GenericAPIView):
    '''
    Представление для действий с шаблонами грамот.
    '''
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
            200: UploadDiplomaTemlplateSuccessResponseSerializer, 
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
        responses={
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
            temp = DiplomaTemplate.objects.get(pk=id)
        except Exception as e:
            return Response({
                'result': False, 
                'message': _(e.__str__())
            }, 500)
        temp.delete()
        return Response({'result': True, 'message': _('Template delete successful.')})

@swagger_auto_schema(
    method="post",
    request_body=GenerateDiplomaRequestSerializer,
    responses={
        200: GenerateDiplomaResponseSerializer,
        401: UnauthorizedResponseSerializer,
        500: FailResponseSerializer
    }
)
@api_view(["POST"])
def generate_diploma(request):
    '''
    Представление для генерации грамот
    '''
    
    if not request.user.is_authenticated:
        return Response({
            'result': False, 
            'message': _('User is not authenticated.')
        }, 401)
    # получяем массив с именами учеников
    names = json.loads(request.POST.get('names'))

    # Если длинна массива равна одному, значит пришел запрос на тестовую грамоту, следовательно zip-файла создавать не нужно
    if len(names) <= 1:
        url = generate_image_object(request.POST, names[0], False)
        return Response({
            'result': True,
            'message': _('Images was generated.'),
            'url': url
        })
    
    buffer = io.BytesIO()
    zip_file = zipfile.ZipFile(buffer, 'w')

    for i in names:
        b = io.BytesIO()

        path = generate_image_object(request.POST, i, True)
        image = Image.open(path)
        image.save(b, format='PNG')

        b.seek(0)

        zip_file.writestr(path.split('\\')[-1], b.read())

    zip_file.close()

    f = ZipFile.objects.create(file=InMemoryUploadedFile(buffer, None, "TestZip.zip", 'application/zip', buffer.tell, None))
    f.save()

    return Response({
        'result': True, 
        'message': _('Images has been generated.'), 
        'url': f.file.url,
        'path': f.file.path
    }, 200)

class AnaliticsView(GenericAPIView):
    queryset = Diploma.objects.all()

    @swagger_auto_schema(
        manual_parameters=analitics_query_parametrs,
        responses={
            200: AnaliticsResponseSerializer,
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
        id = request.GET.get("id")
        try:
            id = int(id)
        except:
            return Response({
                "result": False,
                "message": _("Type of parametr id should be integer.")
            }, 500)
        count = self._get_template_objects_count(id)

        return Response({
            "result": True,
            "message": _("Templates count has been returned."),
            "count": count
        })

    def _get_templates_count(self) -> int:
        return self.get_queryset().count

    def _get_template_objects_count(self, id: int) -> int:
        templates = self.get_queryset().filter(temp__id=id)
        return templates.count

