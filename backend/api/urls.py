from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AlbumViewSet,
    ArtistViewSet,
    FavoriteViewSet,
    PlaylistViewSet,
    TrackViewSet,
    UserProfileViewSet,
    current_user,
    health_check,
)
from .premium_views import premium_activate, premium_cancel, premium_status

router = DefaultRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'tracks', TrackViewSet)
router.register(r'playlists', PlaylistViewSet, basename='playlist')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'profiles', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('me/', current_user, name='current-user'),
    path('premium/', premium_status, name='premium-status'),
    path('premium/activate/', premium_activate, name='premium-activate'),
    path('premium/cancel/', premium_cancel, name='premium-cancel'),
    path('', include(router.urls)),
]