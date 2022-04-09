from rest_framework import serializers

from generator.models import Diploma, DiplomaTemplate


class DipomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diploma
        fields = "__all__"

class DiplomaTemplateSerializer(serializers.ModelSerializer):
    # get_generated_diplomas_count - метод в модели DiplomaTemplate, данная перемнная возвращает значение, возвращаемое этим методом
    diplomas_count = serializers.IntegerField(source="get_generated_diplomas_count", read_only=True)

    class Meta:
        model = DiplomaTemplate
        fields = '__all__'
