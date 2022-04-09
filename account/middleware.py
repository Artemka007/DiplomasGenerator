from django.http import HttpResponseRedirect, JsonResponse
from django.utils.deprecation import MiddlewareMixin

from account.utils import check_token


class AuthMiddleware(MiddlewareMixin):
    '''
    Промежуточное ПО для авторизации по файлам cookie или по токену.
    '''
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, *view_args, **view_kwargs):
        '''
        Функция авторизации и проверки токена.

        Выполняет следующие действия:
        1. Проверяет, аутентифицирован ли пользователь. Если да, то возвращает None (ничего не предпринимает). Если нет, то переходит дальше.
        2. Берет токен из заголовка "Authorization"
        3. Проверяет наличие токена. Если токен не пришел, то редиректит на страницу логина (раз нет токена, значить запрос из браузера). Если токен пришел, то переходит к проверке токена.
        4. Проверяет токен на правильность с помощью функции :check_token:`account.utils.check_token`
        5. Если токен не корректный, то возвращает сообщение, что пользователь не авторизован с ошибкой 401.
        '''
        if request.user.is_authenticated: # 1
            return None
        token = request.META.get("HTTP_AUTHORIZATION", None) # 2
        if token is None: # 3
            if request.get_full_path() != '/account/sign_in/':
                return HttpResponseRedirect("/account/sign_in/")
            return None
        is_authenticated = check_token(token) # 4
        if not is_authenticated: # 5
            return JsonResponse({"result": False, "message": "Пользователь не авторизован."}, status=401)
        return None

class SecurityMiddleware(MiddlewareMixin):
    '''
    ПО, отклющающее проверку CSRF-токена, если пришел токен авторизации.
    '''
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def proccess_view(self, request, view_func, *view_args, **view_kwargs):
        http_auth = request.META.get("HTTP_AUTHORIZATION")
        if http_auth:
            setattr(request, '_dont_enforce_csrf_checks', True)
