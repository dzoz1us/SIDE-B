from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'branches', views.BranchViewSet)
router.register(r'records', views.RecordViewSet)
router.register(r'reservations', views.ReservationViewSet)
router.register(r'tracks', views.TrackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]