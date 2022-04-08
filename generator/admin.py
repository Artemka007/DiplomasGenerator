from django.contrib import admin

from generator.models import Diploma, DiplomaTemplate, ZipFile

admin.site.register(DiplomaTemplate)
admin.site.register(Diploma)
admin.site.register(ZipFile)
