from drf_yasg import openapi

upload_template_formdata_parametrs = [
]

delete_template_query_parametrs = [
    openapi.Parameter('id', openapi.IN_QUERY, description="Id шаблона для удаления", type=openapi.TYPE_NUMBER)
]
