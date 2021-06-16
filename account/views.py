from django.http import JsonResponse

from django.utils.translation.trans_null import gettext_lazy as _
from django.shortcuts import render

from .forms import SignUpForm

from django.conf import settings

def sign_up(request):
    form = SignUpForm()
    if request.method == 'GET':
        return render(request, 'registration/sign_up.html', {'form': form})
    
    elif request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'result': True, 'message': _('Form saved successful.'), 'redirect_to': settings.LOGIN_REDIRECT_URL or '/'})
        else:
            return JsonResponse({'message': _('Something was wrong... Please, try again.'), 'result': False, 'errors': form.errors})

    return JsonResponse({'result': False, 'message': _('Method is not allowed.')})