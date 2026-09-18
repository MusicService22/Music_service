from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Album, Artist, Favorite, Playlist, Track, UserProfile
from .serializers import (
    AlbumSerializer,
    ArtistSerializer,
    FavoriteSerializer,
    PlaylistSerializer,
    TrackSerializer,
    UserProfileSerializer,
)


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.prefetch_related('albums', 'tracks').all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.select_related('artist').prefetch_related('tracks').all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.select_related('artist', 'album').all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Playlist.objects.select_related('user').prefetch_related(
            'playlist_tracks__track__artist',
            'playlist_tracks__track__album',
        )

        if self.request.user.is_authenticated:
            return queryset.filter(Q(is_public=True) | Q(user=self.request.user)).distinct()

        return queryset.filter(is_public=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.select_related('user', 'track__artist', 'track__album').filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.select_related('user').filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
def health_check(request):
    """Простий ендпоінт для перевірки, що API живе."""
    return Response({'status': 'ok'})
