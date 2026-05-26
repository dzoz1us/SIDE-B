from rest_framework import serializers
from .models import Ensemble, Musician, Participation, Composition


class EnsembleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ensemble
        fields = ['id', 'name', 'type', 'founded', 'country', 'image']


class EnsembleDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Ensemble
        fields = ['id', 'name', 'type', 'founded', 'country', 'description', 'image', 'members']

    def get_members(self, obj):
        participations = obj.participations.select_related('musician').all()
        return [{
            'participation_id': p.id,
            'musician_id': p.musician.id,
            'first_name': p.musician.first_name,
            'last_name': p.musician.last_name,
            'role': p.role,
            'instrument': p.instrument,
        } for p in participations]


class MusicianSerializer(serializers.ModelSerializer):
    ensembles = serializers.SerializerMethodField()

    class Meta:
        model = Musician
        fields = ['id', 'first_name', 'last_name', 'birth_date', 'biography', 'instruments', 'image', 'ensembles']

    def get_ensembles(self, obj):
        participations = obj.participations.select_related('ensemble').all()
        return [{
            'ensemble_id': p.ensemble.id,
            'ensemble_name': p.ensemble.name,
            'role': p.role,
        } for p in participations]


class CompositionSerializer(serializers.ModelSerializer):
    composer_name = serializers.SerializerMethodField()

    class Meta:
        model = Composition
        fields = ['id', 'title', 'duration', 'composer', 'composer_name']

    def get_composer_name(self, obj):
        if obj.composer:
            return f'{obj.composer.first_name} {obj.composer.last_name}'
        return None
    
class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = ['id', 'musician', 'ensemble', 'role', 'instrument']