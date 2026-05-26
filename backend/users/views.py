from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, ActionLog
from .serializers import RegisterSerializer, UserProfileSerializer, CreateManagerSerializer, ActionLogSerializer
from django.shortcuts import get_object_or_404
from .permissions import IsAuthenticatedEvenIfBlocked

class ManagerDetailView(generics.RetrieveUpdateAPIView):
    """Получение и редактирование менеджера"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def get_queryset(self):
        return CustomUser.objects.filter(role=CustomUser.Role.MANAGER)


class ManagerToggleBlockView(APIView):
    """Блокировка / разблокировка менеджера"""
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def post(self, request, pk):
        manager = get_object_or_404(CustomUser, pk=pk, role=CustomUser.Role.MANAGER)
        manager.is_active = not manager.is_active
        manager.save()
        return Response({
            'message': f'Менеджер {manager.email} {"разблокирован" if manager.is_active else "заблокирован"}',
            'is_active': manager.is_active,
        })


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedEvenIfBlocked]

    def get_object(self):
        return self.request.user


class ManagerCreateView(generics.CreateAPIView):
    serializer_class = CreateManagerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.is_active = True 
        user.save()
        return Response({
            'message': f'Менеджер {user.email} создан',
            'user': UserProfileSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class ManagerListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def get_queryset(self):
        return CustomUser.objects.filter(role=CustomUser.Role.MANAGER)

class ActionLogListView(generics.ListAPIView):
    serializer_class = ActionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def get_queryset(self):
        return ActionLog.objects.select_related('user').all()[:100]
    
class ManagerDeleteView(generics.DestroyAPIView):
    """Удаление менеджера"""
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def get_queryset(self):
        return CustomUser.objects.filter(role=CustomUser.Role.MANAGER)