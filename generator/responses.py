from diplomasgenerator.responses import ResponseSerializer, StringListField
from rest_framework import serializers

from generator.serializers import DiplomaTemplateSerializer


class GetDiplomaTemplateSuccessResponse(ResponseSerializer):
    templates = DiplomaTemplateSerializer(read_only=True, many=True)

class UploadDiplomaTemlplateSuccessResponseSerializer(ResponseSerializer):
    url = serializers.CharField()
    id = serializers.IntegerField(default=1)

