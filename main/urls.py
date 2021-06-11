from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('editor/', editor, name='editor'),
    path('templates/', get_diplomas_templates, name='get_diplomas_templates'),
    path('generator/', generate_diploma, name='generate_diploma'),
]
