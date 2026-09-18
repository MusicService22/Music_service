from rest_framework import serializers

from .models import Album, Artist, Favorite, Playlist, PlaylistTrack, Track, UserProfile


class TrackSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.name', read_only=True)
    album_title = serializers.CharField(source='album.title', read_only=True)

    class Meta:
        model = Track
        fields = [
            'id',
            'title',
            'artist',
            'artist_name',
            'album',
            'album_title',
            'duration_seconds',
            'genre',
            'track_number',
            'audio_file',
            'created_at',
            'updated_at',
        ]


class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.name', read_only=True)
    tracks = TrackSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = [
            'id',
            'title',
            'artist',
            'artist_name',
            'description',
            'release_date',
            'cover_image',
            'created_at',
            'updated_at',
            'tracks',
        ]


class ArtistSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True, read_only=True)
    albums = AlbumSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio', 'image', 'created_at', 'updated_at', 'albums', 'tracks']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'display_name', 'bio', 'avatar', 'created_at', 'updated_at']
        read_only_fields = ['user']


class PlaylistTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)
    track_id = serializers.PrimaryKeyRelatedField(queryset=Track.objects.all(), source='track', write_only=True)

    class Meta:
        model = PlaylistTrack
        fields = ['id', 'track', 'track_id', 'position', 'added_at']


class PlaylistSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    playlist_tracks = PlaylistTrackSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = [
            'id',
            'user',
            'username',
            'name',
            'description',
            'cover_image',
            'is_public',
            'created_at',
            'updated_at',
            'playlist_tracks',
        ]
        read_only_fields = ['user']


class FavoriteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    track = TrackSerializer(read_only=True)
    track_id = serializers.PrimaryKeyRelatedField(queryset=Track.objects.all(), source='track', write_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'username', 'track', 'track_id', 'created_at']
        read_only_fields = ['user']
