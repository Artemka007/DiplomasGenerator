from django.forms import *

from main.models import GeneratedDiplomas


class GeneratedDiplomasForm(ModelForm):
    class Meta:
        model = GeneratedDiplomas
        fields = '__all__'
