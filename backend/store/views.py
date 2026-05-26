from datetime import timedelta
from music.models import Composition
from django.utils import timezone
from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Branch, Record, Reservation, ReservationStatus, Track
from .serializers import (
    BranchSerializer,
    RecordListSerializer,
    RecordDetailSerializer,
    ReservationCreateSerializer,
    ReservationListSerializer,
)


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def check_permissions(self, request):
        super().check_permissions(request)
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if not request.user.is_admin:
                self.permission_denied(request)


class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.select_related('ensemble', 'branch').all()
    filterset_fields = ['ensemble', 'label', 'branch']
    search_fields = ['title', 'catalogue_number', 'ensemble__name']
    ordering_fields = ['release_date', 'retail_price', 'stock_quantity', 'sold_current_year']

    def get_serializer_class(self):
        if self.action == 'list':
            return RecordListSerializer
        return RecordDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'sell']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def check_permissions(self, request):
        super().check_permissions(request)
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'sell']:
            if not request.user.is_manager:
                self.permission_denied(request)

    @action(detail=True, methods=['post'])
    def sell(self, request, pk=None):
        """Офлайн-продажа (без брони)"""
        record = self.get_object()
        if record.stock_quantity <= 0:
            return Response({'error': 'Нет в наличии'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            record.stock_quantity -= 1
            record.sold_current_year += 1
            record.save(update_fields=['stock_quantity', 'sold_current_year'])
        return Response({'status': 'sold', 'stock_quantity': record.stock_quantity})

    @action(detail=False, methods=['get'])
    def top_sellers(self, request):
        """Лидеры продаж текущего года"""
        top = Record.objects.order_by('-sold_current_year')[:10]
        serializer = RecordListSerializer(top, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post', 'get'])
    def tracks(self, request, pk=None):
        """Управление треклистом пластинки"""
        record = self.get_object()
        
        if request.method == 'GET':
            from music.serializers import CompositionSerializer
            tracks = record.tracks.select_related('composition').all()
            return Response([{
                'track_number': t.track_number,
                'composition': CompositionSerializer(t.composition).data
            } for t in tracks])
        
        # POST: добавление дорожки
        composition_id = request.data.get('composition')
        track_number = request.data.get('track_number')

        if not composition_id or not track_number:
            return Response({'error': 'Укажите composition и track_number'}, status=status.HTTP_400_BAD_REQUEST)

        composition = Composition.objects.get(id=composition_id)
        track, created = Track.objects.get_or_create(
            record=record,
            track_number=track_number,
            defaults={'composition': composition}
        )
        
        if not created:
            track.composition = composition
            track.save()
            
        return Response({'status': 'created' if created else 'updated', 'track_id': track.id})


class TrackViewSet(viewsets.ModelViewSet):
    """Отдельный ViewSet для треков (удаление)"""
    queryset = Track.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_admin:
            self.permission_denied(request)

    def destroy(self, request, *args, **kwargs):
        track = self.get_object()
        record_id = track.record.id
        track.delete()
        return Response({'status': 'deleted', 'record_id': record_id})


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.select_related('record', 'branch', 'status').all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ReservationCreateSerializer
        return ReservationListSerializer

    def get_queryset(self):
        if self.request.user.is_manager:
            return Reservation.objects.select_related('record', 'branch', 'status').all()
        return Reservation.objects.filter(user=self.request.user).select_related('record', 'branch', 'status')

    def perform_create(self, serializer):
        active_status, _ = ReservationStatus.objects.get_or_create(name='active')
        expires_at = timezone.now() + timedelta(hours=48)
        serializer.save(
            user=self.request.user,
            status=active_status,
            expires_at=expires_at
        )

    @action(detail=False, methods=['get'])
    def my(self, request):
        """Брони текущего пользователя"""
        reservations = self.get_queryset().filter(user=request.user)
        page = self.paginate_queryset(reservations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отмена брони пользователем"""
        reservation = self.get_object()
        if reservation.user != request.user:
            return Response({'error': 'Не ваша бронь'}, status=status.HTTP_403_FORBIDDEN)
        if reservation.status.name != 'active':
            return Response({'error': 'Бронь уже неактивна'}, status=status.HTTP_400_BAD_REQUEST)
        cancelled_status, _ = ReservationStatus.objects.get_or_create(name='cancelled')
        reservation.status = cancelled_status
        reservation.save()
        return Response({'status': 'cancelled'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Выдача заказа менеджером"""
        if not request.user.is_manager:
            return Response({'error': 'Только для менеджера'}, status=status.HTTP_403_FORBIDDEN)
        reservation = self.get_object()
        if reservation.status.name != 'active':
            return Response({'error': 'Бронь неактивна'}, status=status.HTTP_400_BAD_REQUEST)
        completed_status, _ = ReservationStatus.objects.get_or_create(name='completed')
        reservation.status = completed_status
        reservation.completed_at = timezone.now()
        reservation.save()
        return Response({'status': 'completed'})

    @action(detail=True, methods=['post'])
    def expire(self, request, pk=None):
        """Снятие просроченной брони"""
        if not request.user.is_manager:
            return Response({'error': 'Только для менеджера'}, status=status.HTTP_403_FORBIDDEN)
        reservation = self.get_object()
        if reservation.status.name != 'active':
            return Response({'error': 'Бронь неактивна'}, status=status.HTTP_400_BAD_REQUEST)
        expired_status, _ = ReservationStatus.objects.get_or_create(name='expired')
        reservation.status = expired_status
        reservation.save()
        return Response({'status': 'expired'})