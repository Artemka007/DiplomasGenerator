from django.urls import path

from .views import *

urlpatterns = [
    path('analitics/', AnaliticsView.as_view(), name="analitics"),
    path('templates/', DiplomaTemplates.as_view(), name='get_diplomas_templates'),
    path('generator/', generate_diploma, name='generate_diploma'),
]
