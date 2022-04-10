from django.urls import path

from .views import *

urlpatterns = [
    path('analitics/', AnaliticsView.as_view(), name="analitics"),
    path('templates/get/', get_templates, name="get_templates"),
    path('templates/create/', create_template, name="create_template"),
    path('templates/delete/', delete_template, name="delete_template"),
    path('generator/', GenerateDiplomaView.as_view(), name='generate_diploma'),
]
