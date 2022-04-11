from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render


@login_required
def index(request):
    return HttpResponseRedirect("/editor/")


@login_required
def editor(request):
    return render(request, 'diploma_editor.html')

