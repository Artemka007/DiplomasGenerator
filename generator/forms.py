from django.forms import *

from generator.models import ExcelForGenerate, GeneratedDiplomas


class GeneratedDiplomasForm(ModelForm):
    class Meta:
        model = GeneratedDiplomas
        fields = '__all__'


class SaveExcel(ModelForm):
    class Meta:
        model = ExcelForGenerate
        fields = '__all__'
