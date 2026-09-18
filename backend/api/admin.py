from django.contrib import admin

from .models import Album, Artist, Favorite, Playlist, PlaylistTrack, Track, UserProfile


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')
    search_fields = ('name',)


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'artist', 'release_date', 'created_at')
    list_filter = ('artist', 'release_date')
    search_fields = ('title', 'artist__name')


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'artist', 'album', 'genre', 'duration_seconds', 'created_at')
    list_filter = ('artist', 'album', 'genre')
    search_fields = ('title', 'artist__name', 'album__title')


class PlaylistTrackInline(admin.TabularInline):
    model = PlaylistTrack
    extra = 1
    autocomplete_fields = ('track',)


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'is_public', 'updated_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('name', 'user__username')
    inlines = [PlaylistTrackInline]


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'track', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'track__title')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'display_name', 'created_at')
    search_fields = ('user__username', 'display_name')
