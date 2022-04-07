from django.forms import *

from generator.models import GeneratedDiplomas


class GeneratedDiplomasForm(ModelForm):
    class Meta:
        model = GeneratedDiplomas
        fields = '__all__'

