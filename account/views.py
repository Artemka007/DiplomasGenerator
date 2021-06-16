from django.http import JsonResponse

from django.utils.translation.trans_null import gettext_lazy as _

from .forms import SignUpForm

from django.contrib import settings

def sign_up(request):
    if request.method == 'POST':
        form = SignUpForm(data=request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'result': True, 'message': _('Form saved succesful.'), 'redirect_to': settings.LOGIN_REDIRECT_URL})
        else:
            return JsonResponse({'message': _('Something was wrong... Please, try again.'), 'result': False, 'errors': form.errors})

    return JsonResponse({'result': False, 'message': _('Method is not allowed.')})