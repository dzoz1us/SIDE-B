from django.test import TestCase


class EnsembleModelTest(TestCase):
    def setUp(self):
        from music.models import Ensemble
        self.ensemble = Ensemble.objects.create(
            name='Тест-группа', type='Квартет', founded=2020
        )

    def test_ensemble_creation(self):
        self.assertEqual(self.ensemble.name, 'Тест-группа')


class MusicianModelTest(TestCase):
    def setUp(self):
        from music.models import Musician
        self.musician = Musician.objects.create(
            first_name='Петр', last_name='Тестов', instruments='Гитара'
        )

    def test_musician_creation(self):
        self.assertEqual(self.musician.first_name, 'Петр')


class ParticipationModelTest(TestCase):
    def setUp(self):
        from music.models import Ensemble, Musician, Participation
        self.ensemble = Ensemble.objects.create(name='Группа', type='Рок')
        self.musician = Musician.objects.create(first_name='Иван', last_name='Иванов')

    def test_participation_creation(self):
        from music.models import Participation
        p = Participation.objects.create(
            musician=self.musician, ensemble=self.ensemble,
            role='исполнитель', instrument='Бас'
        )
        self.assertEqual(p.role, 'исполнитель')


class CompositionModelTest(TestCase):
    def setUp(self):
        from music.models import Musician
        self.composer = Musician.objects.create(first_name='Автор', last_name='Авторов')

    def test_composition_creation(self):
        from music.models import Composition
        comp = Composition.objects.create(
            title='Песня', duration=200, composer=self.composer
        )
        self.assertEqual(comp.title, 'Песня')