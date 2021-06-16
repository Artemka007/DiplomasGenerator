from django.urls import path
from django.contrib.auth.views import *
from .views import sign_up

urlpatterns = [
    path('sign_in/', LoginView.as_view(), name='login'),
    path('sign_up/', sign_up, name='sign_up'),
    path('sign_out/', logout_then_login),
]