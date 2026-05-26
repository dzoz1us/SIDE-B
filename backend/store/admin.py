from django.contrib import admin
from .models import Branch, Record, Track, Reservation, ReservationStatus

admin.site.register(Branch)
admin.site.register(Record)
admin.site.register(Track)
admin.site.register(Reservation)
admin.site.register(ReservationStatus)