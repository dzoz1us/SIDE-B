from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'ensembles', views.EnsembleViewSet)
router.register(r'musicians', views.MusicianViewSet)
router.register(r'compositions', views.CompositionViewSet)
router.register(r'participations', views.ParticipationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]