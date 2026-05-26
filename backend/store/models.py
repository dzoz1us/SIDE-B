from django.db import models
from users.models import CustomUser
from music.models import Ensemble, Composition


class Branch(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=50, blank=True)
    opening_hours = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Record(models.Model):
    catalogue_number = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    ensemble = models.ForeignKey(Ensemble, on_delete=models.CASCADE, related_name='records')
    label = models.CharField(max_length=255, blank=True)
    supplier_address = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True)
    wholesale_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    retail_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock_quantity = models.IntegerField(default=0)
    sold_last_year = models.IntegerField(default=0)
    sold_current_year = models.IntegerField(default=0)
    cover_image = models.ImageField(upload_to='records/', null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='records')

    class Meta:
        ordering = ['-release_date']

    def __str__(self):
        return f'{self.title} ({self.catalogue_number})'


class Track(models.Model):
    record = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='tracks')
    composition = models.ForeignKey(Composition, on_delete=models.CASCADE)
    track_number = models.IntegerField()

    class Meta:
        ordering = ['track_number']
        unique_together = ('record', 'track_number')

    def __str__(self):
        return f'{self.track_number}. {self.composition.title}'


class ReservationStatus(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = 'Reservation statuses'

    def __str__(self):
        return self.name


class Reservation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reservations')
    record = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='reservations')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    status = models.ForeignKey(ReservationStatus, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Бронь №{self.id} — {self.record.title} ({self.user.email})'