from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AlbumViewSet, ArtistViewSet, FavoriteViewSet, PlaylistViewSet, TrackViewSet, UserProfileViewSet, health_check

router = DefaultRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'tracks', TrackViewSet)
router.register(r'playlists', PlaylistViewSet, basename='playlist')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'profiles', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', include(router.urls)),
]
