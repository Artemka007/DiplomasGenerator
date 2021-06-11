from rest_framework import serializers

from main.models import DiplomaTemplate


class DiplomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiplomaTemplate
        fields = '__all__'
