# DiplomasGenerator

## Структура проекта:
  * /diplomasgenerator - файлы проекта:
    - /api.py - файл сборки документации.
    - /asgi.py - сборка ассинхронного приложения.
    - /responses.py - базовые сериализаторы API-ответов для документации.
    - /settings.py - настройки приложения.
    - /urls.py - сборка эндпоинтов приложения.
    - /wsgi.py - сборка синхронного приложения.
  * /generator - основное приложение для генерации грамот по API-запросу:
    - /admin.py - настройки административной панели приложения.
    - /apidocs.py - некоторые переменные для документации.
    - /apps.py - конфигурационный файл приложения.
    - /forms.py
    - /models.py
    - /requests.py - сериализаторы API-запросов для документации.
    - /responses.py - сериализаторы API-ответов для документации.
    - /serializers.py - сериализаторы (приобразователи объекта модели в формат JSON).
    - /tests.py
    - /urls.py
    - /utils.py - функции для работы с изображениями грамот.
    - /views.py - контроллеры (в django - view-функции).
  * /account - приложение для логина и регистрации, структура практически аналогична предыдущей, кроме
    - /middleware.py - промежуточное ПО для авторизации и безопасности.
  * /main - приложение для рендера UI, структура практически аналогична предыдущей.
  * /static - UI приложения.
  * /templates - представления предложения (в django - шаблоны).
  * requirements.txt - завимимости проекта.
  * manage.py - файл работы с командной строкой. 
----------------------------------------------------------------------------------------------
## Последовательность действий при установке проекта, без учета использования Docker или proxy-сервера:
  * python3 -m venv venv - создание виртуального окружения.
  * pip install -r requirements.txt - установка зависимостей.
  * python manage.py migrate & python manage.py makemigrations - создание и применение миграций.
  * python manage.py createsuperuser - создание аккаунта администратора.
  * python manage.py runserver - запуск сервера.
----------------------------------------------------------------------------------------------
## Что необходимо изменить в коде:
/diplomasgenerator/settings.py
  ```python 
  SECRET_KEY = "mega_secret_key"
  DEBUG = False
  ALLOWED_HOSTS = ["example.com"] 
  CORS_ALLOWED_ORIGINS = ["http://example.com"] 
  ```
----------------------------------------------------------------------------------------------
## Ключевые технологии, используемые в проекте:
  * Языки:
    - python 3
    - javascript
  * Фреймворки и библиотеки:
    - django
    - jQuery
