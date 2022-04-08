from django.db import models


class DiplomaTemplate(models.Model):
    src = models.ImageField(upload_to='diplomas/')


class Diploma(models.Model):
    src = models.ImageField(upload_to='diplomas/generated/')
    temp = models.ForeignKey(DiplomaTemplate, on_delete=models.CASCADE, related_name="diplomas", null=True, blank=True)

    def get_full_url(self):
        return self.src.url


class ZipFile(models.Model):
    file = models.FileField(upload_to='diplomas/zip/')
