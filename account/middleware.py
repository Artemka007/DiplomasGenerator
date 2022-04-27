from django.http import HttpResponseRedirect, JsonResponse

from account.utils import check_token


class AuthMiddleware(object):
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
        2. Получает токен и пользователя из данных в запросе.
        3. Проверяет наличие токена. Если токен не пришел, то редиректит на страницу логина (раз нет токена, значить запрос из браузера). Если токен пришел, то переходит к проверке токена.
        4. Проверяет токен на правильность с помощью функции :py:func:`~account.utils.check_token`
        5. Если токен не корректный, то возвращает сообщение, что пользователь не авторизован с ошибкой 401.
        '''
        print(request.path)
        if request.user.is_authenticated or request.path == "/account/sign_in/": # 1
            return None
        data = request.POST.get("auth", None) #
        username = data.get("api_user")       # 2
        token = data.get("api_secret")        # 
        if token is None: # 3
            if request.get_full_path() != '/account/sign_in/':
                return HttpResponseRedirect("/account/sign_in/")
            return None
        is_correct = check_token(token, username) # 4
        if not is_correct: # 5
            return JsonResponse({"result": False, "message": "Пользователь не авторизован."}, status=401)
        return None

class SecurityMiddleware(object):
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
