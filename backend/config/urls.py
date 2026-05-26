from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('users.urls')),
    path('api/v1/', include('music.urls')),
    path('api/v1/', include('store.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
