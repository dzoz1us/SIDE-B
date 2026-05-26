from django.contrib import admin
from .models import Ensemble, Musician, Participation, Composition

admin.site.register(Ensemble)
admin.site.register(Musician)
admin.site.register(Participation)
admin.site.register(Composition)