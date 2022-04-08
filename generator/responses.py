from email.policy import default

from diplomasgenerator.responses import ResponseSerializer
from rest_framework import serializers

from generator.serializers import DiplomaTemplateSerializer


class GetDiplomaTemplateSuccessResponse(ResponseSerializer):
    templates = DiplomaTemplateSerializer(read_only=True, many=True)

class UploadDiplomaTemlplateSuccessResponseSerializer(ResponseSerializer):
    url = serializers.CharField()
    id = serializers.IntegerField(default=1)

class GenerateDiplomaResponseSerializer(ResponseSerializer):
    url = serializers.CharField(default="https://example.com/media/img.jpg")
    path = serializers.CharField(default="/data/www/example.com/media/img.jpg")

class AnaliticsResponseSerializer(ResponseSerializer):
    count = serializers.IntegerField(default=10)
