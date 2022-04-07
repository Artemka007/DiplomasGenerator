from django.contrib import admin

from generator.models import DiplomaTemplate, GeneratedDiplomas, ZipFile

admin.site.register(DiplomaTemplate)
admin.site.register(GeneratedDiplomas)
admin.site.register(ZipFile)
