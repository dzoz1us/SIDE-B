from rest_framework import viewsets, permissions
from .models import Ensemble, Musician, Composition, Participation
from rest_framework.pagination import PageNumberPagination

from .serializers import (
    EnsembleListSerializer,
    EnsembleDetailSerializer,
    MusicianSerializer,
    CompositionSerializer,
    ParticipationSerializer
)


class EnsembleViewSet(viewsets.ModelViewSet):
    queryset = Ensemble.objects.all()
    search_fields = ['name']
    ordering_fields = ['name', 'founded']

    def get_serializer_class(self):
        if self.action == 'list':
            return EnsembleListSerializer
        return EnsembleDetailSerializer


class MusicianViewSet(viewsets.ModelViewSet):
    queryset = Musician.objects.all()
    serializer_class = MusicianSerializer
    search_fields = ['first_name', 'last_name']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def check_permissions(self, request):
        super().check_permissions(request)
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if not request.user.is_admin:
                self.permission_denied(request)


class CompositionViewSet(viewsets.ModelViewSet):
    queryset = Composition.objects.select_related('composer').all()
    serializer_class = CompositionSerializer
    search_fields = ['title']
    pagination_class = PageNumberPagination

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def check_permissions(self, request):
        super().check_permissions(request)
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if not request.user.is_admin:
                self.permission_denied(request)

class ParticipationViewSet(viewsets.ModelViewSet):
    queryset = Participation.objects.all()
    serializer_class = ParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def create(self, request, *args, **kwargs):
        print("Данные запроса:", request.data)
        return super().create(request, *args, **kwargs)

