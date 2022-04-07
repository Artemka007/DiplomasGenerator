from django.db import models


class DiplomaTemplate(models.Model):
    src = models.ImageField(upload_to='diplomas/')


class GeneratedDiplomas(models.Model):
    generated_diploma = models.ImageField(upload_to='diplomas/generated/')

    def get_full_url(self):
        return self.generated_diploma.url


class ZipFile(models.Model):
    file = models.FileField(upload_to='diplomas/zip/')
