from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .serializers import EmailTokenObtainPairSerializer

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', EmailTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('managers/', views.ManagerListView.as_view(), name='manager-list'),
    path('managers/create/', views.ManagerCreateView.as_view(), name='manager-create'),
    path('managers/<int:pk>/', views.ManagerDetailView.as_view(), name='manager-detail'),
    path('managers/<int:pk>/toggle-block/', views.ManagerToggleBlockView.as_view(), name='manager-toggle-block'),
    path('logs/', views.ActionLogListView.as_view(), name='action-logs'),
    path('managers/<int:pk>/delete/', views.ManagerDeleteView.as_view(), name='manager-delete'),
]