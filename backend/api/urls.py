from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ArtistViewSet, TrackViewSet, health_check

router = DefaultRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'tracks', TrackViewSet)

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', include(router.urls)),
]
