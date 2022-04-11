from drf_yasg import openapi

upload_template_formdata_parametrs = [
]

delete_template_query_parametrs = [
    openapi.Parameter('id', openapi.IN_QUERY, description="Id шаблона для удаления", type=openapi.TYPE_NUMBER)
]

analitics_query_parametrs = [
    openapi.Parameter('id', openapi.IN_QUERY, description="Id шаблона для нахождения кол-ва грамот по нему.", type=openapi.TYPE_NUMBER)
]

