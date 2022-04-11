import hashlib

from django.conf import settings
from django.utils import timezone


def check_token(token: str, username: str) -> bool:
    """
    Проверяет токен, приходящий в запросе на корректность.

    Args:
        token (str): токен (API-ключ)
        username (str): имя пользователя

    Returns:
        (bool): корректен ли токен.
    """
    API_USER = username
    API_KEY = settings.SECRET_KEY
    LINUX_TIMESTAMP = timezone.now().time.__str__()

    _token = hashlib.md5(
        bytes(f"{API_USER}{API_KEY}{LINUX_TIMESTAMP})", 'utf-8')
    ).hexdigest()

    return token == _token
