from rest_framework import serializers
from .models import Artist, Track


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'title', 'artist', 'duration_seconds', 'audio_file', 'created_at']


class ArtistSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio', 'created_at', 'tracks']
