from diplomasgenerator.responses import StringListField
from rest_framework import serializers


class GenerateDiplomaRequestSerializer(serializers.Serializer):
    x = serializers.CharField()
    y = serializers.CharField()

    names = StringListField()
    
    template_id = serializers.CharField(allow_blank=True)
    template_url = serializers.CharField()

    font_weight = serializers.CharField()
    font_size = serializers.CharField()
    foreground = serializers.CharField()
