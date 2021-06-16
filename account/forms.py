from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from django.utils.translation import gettext_lazy as _


class SignUpForm(UserCreationForm):
    email = forms.EmailField(label='Email address ', required=True, max_length=100)
    first_name = forms.CharField(label='First name ', required=True, max_length=100)
    last_name = forms.CharField(label='Last name ', required=True, max_length=100)
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']