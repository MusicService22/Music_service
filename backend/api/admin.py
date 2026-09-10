from django.contrib import admin
from .models import Artist, Track


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'artist', 'duration_seconds', 'created_at')
    list_filter = ('artist',)
    search_fields = ('title',)
