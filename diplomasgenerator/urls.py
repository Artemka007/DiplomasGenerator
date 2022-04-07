from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .api import urlpatterns as api_urls

urlpatterns = [
    path('', include('main.urls')),
    path('api/v1/', include('generator.urls')),
    path('account/', include('account.urls')),
    path('admin/', admin.site.urls),
] + api_urls
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
