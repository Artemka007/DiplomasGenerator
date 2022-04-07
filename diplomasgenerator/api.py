from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="DiplomasGenerator API",
        default_version='v1',
        description="Some description",
        contact=openapi.Contact(email="kopylovartyom007@gmail.com"),
        license=openapi.License(name="License"),
    ),
    patterns=[path('api/v1/', include('generator.urls')), ],
    public=True,
    permission_classes=(permissions.IsAdminUser,),
)

urlpatterns = [
    path(
        'api/v1/docs/',
        TemplateView.as_view(
            template_name='swaggerui/swaggerui.html',
            extra_context={'schema_url': 'openapi-schema'}
        ),
        name='swagger-ui'
    ),
    re_path(
        r'^swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json'
    ),
]
