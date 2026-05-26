from django.db import models


class Ensemble(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100, blank=True)
    founded = models.IntegerField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='ensembles/', null=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Musician(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField(null=True, blank=True)
    biography = models.TextField(blank=True)
    instruments = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='musicians/', null=True, blank=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Participation(models.Model):
    class Role(models.TextChoices):
        PERFORMER = 'исполнитель', 'Исполнитель'
        CONDUCTOR = 'дирижёр', 'Дирижёр'
        LEADER = 'руководитель', 'Руководитель'

    musician = models.ForeignKey(Musician, on_delete=models.CASCADE, related_name='participations')
    ensemble = models.ForeignKey(Ensemble, on_delete=models.CASCADE, related_name='participations')
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.PERFORMER)
    instrument = models.CharField(max_length=100, blank=True)

    class Meta:
        unique_together = ('musician', 'ensemble', 'role')

    def __str__(self):
        return f'{self.musician} — {self.role} в {self.ensemble}'


class Composition(models.Model):
    title = models.CharField(max_length=255)
    duration = models.IntegerField(help_text='Длительность в секундах')
    composer = models.ForeignKey(Musician, on_delete=models.SET_NULL, null=True, blank=True, related_name='compositions')

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title