from django.contrib.auth.views import *
from django.urls import path

urlpatterns = [
    path('sign_in/', LoginView.as_view(), name='login'),
    path('sign_out/', logout_then_login),
]
