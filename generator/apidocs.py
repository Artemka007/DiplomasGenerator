from drf_yasg import openapi

global_parametrs = [
    openapi.Parameter('Authorization', openapi.IN_HEADER, description="Токен для авторизации.", type=openapi.TYPE_STRING)
]

upload_template_formdata_parametrs = [
]

delete_template_query_parametrs = [
    openapi.Parameter('id', openapi.IN_QUERY, description="Id шаблона для удаления", type=openapi.TYPE_NUMBER)
]

generate_diploma_request_body_parametrs = [
    openapi.Parameter('x', openapi.IN_BODY, description="Id шаблона для удаления", type=openapi.TYPE_STRING)
]

analitics_query_parametrs = [
    openapi.Parameter('id', openapi.IN_QUERY, description="Id шаблона для нахождения кол-ва грамот по нему.", type=openapi.TYPE_NUMBER)
]

