from rest_framework import serializers


class ResponseSerializer(serializers.Serializer):
    result = serializers.BooleanField(default=True)
    message = serializers.CharField()

class FailResponseSerializer(ResponseSerializer):
    result = serializers.BooleanField(default=False)

class UnauthorizedResponseSerializer(ResponseSerializer):
    message = serializers.CharField(default="Пользователь не авторизован.")

class StringListField(serializers.ListField):
    child = serializers.CharField()
