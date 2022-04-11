import io
import json
import zipfile

from diplomasgenerator.responses import (FailResponseSerializer,
                                         ResponseSerializer)
from django.utils.translation.trans_real import gettext as _
from drf_yasg.utils import swagger_auto_schema
from PIL import Image
from rest_framework import parsers
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView, Response

from generator.models import Diploma, DiplomaTemplate, ZipFile
from generator.requests import GenerateDiplomaRequestSerializer
from generator.responses import (
    AnaliticsResponseSerializer, GenerateDiplomaResponseSerializer,
    GetDiplomaTemplateSuccessResponse,
    UploadDiplomaTemlplateSuccessResponseSerializer)
from generator.serializers import DiplomaTemplateSerializer

from .apidocs import *
from .utils import *


@swagger_auto_schema(
    method="post",
    responses={
        200: GetDiplomaTemplateSuccessResponse,
        500: FailResponseSerializer
    }
)
@api_view(["POST"])
def get_templates(request):
    templates = DiplomaTemplate.objects.all()
    return Response({
        'result': True,
        'message': _('The templates has been returned.'),
        'templates': DiplomaTemplateSerializer(templates, many=True).data
    })


@swagger_auto_schema(
    method="post",
    manual_parameters=upload_template_formdata_parametrs, 
    responses={
        200: UploadDiplomaTemlplateSuccessResponseSerializer, 
        500: FailResponseSerializer
    }
)
@api_view(["POST"])
def create_template(request):
    '''
    Создание шаблона грамоты.
    '''
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
        'message': _('The template has been saved.'),
        'id': template_obj.id,
        'url': template_obj.diploma.url,
    })


@swagger_auto_schema(
    method="post",
    manual_parameters=delete_template_query_parametrs,
    responses={
        200: ResponseSerializer,
        500: FailResponseSerializer
    }
)
@api_view(["POST"])
def delete_template(request):
    '''
    Удаление шаблона грамоты.
    '''
    data = request.data.dict()
    id = data.get('data[id]')
    try:
        temp = DiplomaTemplate.objects.get(pk=int(id))
    except Exception as e:
        return Response({
            'result': False, 
            'message': _(e.__str__())
        }, 500)
    temp.delete()
    return Response({'result': True, 'message': _('The template delete successful.')})

class GenerateDiplomaView(APIView):
    @swagger_auto_schema(
        request_body=GenerateDiplomaRequestSerializer,
        responses={
            200: GenerateDiplomaResponseSerializer,
            500: FailResponseSerializer
        }
    )
    def post(self, request):
        '''
        Представление для генерации грамот
        '''
        # получяем массив с именами учеников
        data = request.data.get('data')
        names = data.get('names')

        # Если длинна массива равна одному, значит пришел запрос на тестовую грамоту, следовательно zip-файла создавать не нужно
        if len(names) <= 1:
            url = generate_diploma_object(data, names[0], False)
            return Response({
                'result': True,
                'message': _('Images was generated.'),
                'url': url
            })

        buffer = io.BytesIO()
        zip_file = zipfile.ZipFile(buffer, 'w')

        for i in names:
            b = io.BytesIO()

            path = generate_diploma_object(data, i, True)
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
            500: FailResponseSerializer
        }
    )
    def post(self, request):
        id = request.data.get('data').get('id')
        try:
            id = int(id)
        except:
            return Response({
                "result": False,
                "message": _("Type of parametr id should be an integer.")
            }, 500)
        count = self._get_template_objects_count(id)

        return Response({
            "result": True,
            "message": _(f"Diplomas count that generated by template with id={id} has been returned."),
            "count": count
        })

    def _get_templates_count(self) -> int:
        return self.get_queryset().count()

    def _get_template_objects_count(self, id: int) -> int:
        templates = self.get_queryset().filter(temp__id=id)
        return templates.count()

