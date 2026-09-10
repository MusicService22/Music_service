from django.db import models


class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Track(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='tracks')
    duration_seconds = models.PositiveIntegerField(default=0)
    audio_file = models.FileField(upload_to='tracks/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.artist.name} — {self.title}'
