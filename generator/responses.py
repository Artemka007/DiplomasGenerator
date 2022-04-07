from diplomasgenerator.serializer import (FailResponseSerializer,
                                          ResponseSerializer)
from rest_framework import serializers

from generator.serializers import DiplomaTemplateSerializer


class GetDiplomaTemplateSuccessResponse(ResponseSerializer):
    templates = DiplomaTemplateSerializer(read_only=True, many=True)

class DiplomaUploadSuccessResponseSerializer(ResponseSerializer):
    url = serializers.CharField()
    id = serializers.IntegerField()
