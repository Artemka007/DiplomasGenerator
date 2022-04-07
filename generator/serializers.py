from rest_framework import serializers

from generator.models import DiplomaTemplate


class DiplomaTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiplomaTemplate
        fields = '__all__'
