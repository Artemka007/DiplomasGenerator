from diplomasgenerator.responses import StringListField
from rest_framework import serializers


class GenerateDiplomaTemlplateRequestSerializer(serializers.Serializer):
    x = serializers.CharField()
    y = serializers.CharField()

    names = StringListField()
    template = serializers.CharField()

    font_weight = serializers.CharField()
    font_size = serializers.CharField()
    foreground = serializers.CharField()
