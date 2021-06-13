from django.forms import *

from main.models import GeneratedDiplomas, ExcelForGenerate


class GeneratedDiplomasForm(ModelForm):
    class Meta:
        model = GeneratedDiplomas
        fields = '__all__'


class SaveExcel(ModelForm):
    class Meta:
        model = ExcelForGenerate
        fields = '__all__'
