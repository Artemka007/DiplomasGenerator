from django.urls import path

from .views import *

urlpatterns = [
    path('templates/', DiplomaTemplates.as_view(), name='get_diplomas_templates'),
    path('generator/', generate_diploma, name='generate_diploma'),
    path('get_names/', get_names, name='get_names'),
]
