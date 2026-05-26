from rest_framework import serializers
from .models import Branch, Record, Track, Reservation, ReservationStatus
from music.models import Ensemble
from music.serializers import EnsembleListSerializer


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'


class RecordListSerializer(serializers.ModelSerializer):
    ensemble_name = serializers.CharField(source='ensemble.name', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Record
        fields = [
            'id', 'catalogue_number', 'title', 'ensemble_name', 'branch_name',
            'label', 'release_date', 'retail_price', 'stock_quantity',
            'sold_current_year', 'cover_image'
        ]

    def get_cover_image(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class RecordDetailSerializer(serializers.ModelSerializer):
    ensemble = serializers.PrimaryKeyRelatedField(queryset=Ensemble.objects.all())
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), allow_null=True)
    cover_image = serializers.SerializerMethodField()
    tracks = serializers.SerializerMethodField()

    class Meta:
        model = Record
        fields = [
            'id', 'catalogue_number', 'title', 'ensemble', 'branch',
            'label', 'supplier_address', 'release_date',
            'wholesale_price', 'retail_price', 'stock_quantity',
            'sold_last_year', 'sold_current_year', 'cover_image',
            'tracks',
        ]

    def get_cover_image(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

    def get_tracks(self, obj):
        from music.serializers import CompositionSerializer
        tracks = obj.tracks.select_related('composition').all()
        return [{
            'track_number': t.track_number,
            'composition': CompositionSerializer(t.composition).data
        } for t in tracks]


class ReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['record', 'branch']

    def validate_record(self, record):
        if record.stock_quantity <= 0:
            raise serializers.ValidationError('Пластинка отсутствует на складе')
        return record


class ReservationListSerializer(serializers.ModelSerializer):
    record_title = serializers.CharField(source='record.title', read_only=True)
    record_cover = serializers.SerializerMethodField()
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'record_title', 'record_cover', 'branch_name',
            'status_name', 'created_at', 'expires_at'
        ]

    def get_record_cover(self, obj):
        if obj.record.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.record.cover_image.url)
            return obj.record.cover_image.url
        return None