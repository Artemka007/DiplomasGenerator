from django.forms import *

from generator.models import Diploma


class DiplomaForm(ModelForm):
    class Meta:
        model = Diploma
        fields = '__all__'

