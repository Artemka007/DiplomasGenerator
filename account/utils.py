import hashlib

from django.conf import settings
from django.utils import timezone


def check_token(token: str) -> bool:
    API_USER = settings.API_USER
    API_KEY = settings.SECRET_KEY
    LINUX_TIMESTAMP = timezone.now().time.__str__()

    _token = hashlib.md5(
        bytes(f"{API_USER}{API_KEY}{LINUX_TIMESTAMP})", 'utf-8')
    ).hexdigest()

    return token == _token
