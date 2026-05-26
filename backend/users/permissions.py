from rest_framework.permissions import BasePermission


class IsAuthenticatedEvenIfBlocked(BasePermission):
    """
    Разрешает доступ даже заблокированным пользователям.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)