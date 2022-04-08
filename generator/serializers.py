from rest_framework import serializers

from generator.models import Diploma, DiplomaTemplate


class DipomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diploma
        fields = "__all__"

class DiplomaTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiplomaTemplate
        fields = '__all__'
