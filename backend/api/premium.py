from rest_framework.exceptions import PermissionDenied

from .models import Favorite, Playlist

# Ліміти безкоштовного плану. Змінюються тут, в одному місці.
FREE_FAVORITES_LIMIT = 2
FREE_PLAYLISTS_LIMIT = 2


def is_premium(user):
    """True, якщо в користувача є активна підписка."""
    if not user or not user.is_authenticated:
        return False
    sub = getattr(user, 'subscription', None)  # немає підписки означає None
    return bool(sub and sub.is_active)


def check_favorite_limit(user):
    """Викликається перед додаванням в обране."""
    if is_premium(user):
        return
    if Favorite.objects.filter(user=user).count() >= FREE_FAVORITES_LIMIT:
        raise PermissionDenied(
            f'Ліміт безкоштовного плану в обраному: {FREE_FAVORITES_LIMIT}. '
            'Оформіть Premium, щоб зняти обмеження.'
        )


def check_playlist_limit(user):
    """Викликається перед створенням плейлиста."""
    if is_premium(user):
        return
    if Playlist.objects.filter(user=user).count() >= FREE_PLAYLISTS_LIMIT:
        raise PermissionDenied(
            f'Ліміт безкоштовного плану для плейлистів: {FREE_PLAYLISTS_LIMIT}. '
            'Оформіть Premium, щоб зняти обмеження.'
        )