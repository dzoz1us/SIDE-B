from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions


class JWTAuthenticationEvenIfBlocked(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token['user_id']
        except KeyError:
            raise exceptions.AuthenticationFailed('Token contained no recognizable user identification')
        try:
            user = self.user_model.objects.get(**{'pk': user_id})
        except self.user_model.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found')
        # Не проверяем is_active — разрешаем всем
        return user