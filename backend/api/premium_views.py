from datetime import timedelta

from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Favorite, Playlist, Subscription
from .premium import FREE_FAVORITES_LIMIT, FREE_PLAYLISTS_LIMIT, is_premium


def build_status(user):
    """Збирає відповідь: який план, до коли діє, скільки використано з ліміту."""
    premium = is_premium(user)
    sub = getattr(user, 'subscription', None)
    return {
        'is_premium': premium,
        'expires_at': sub.expires_at if premium else None,
        'free_limits': {
            'favorites': FREE_FAVORITES_LIMIT,
            'playlists': FREE_PLAYLISTS_LIMIT,
        },
        'favorites': {
            'used': Favorite.objects.filter(user=user).count(),
            'limit': None if premium else FREE_FAVORITES_LIMIT,  # None означає без обмежень
        },
        'playlists': {
            'used': Playlist.objects.filter(user=user).count(),
            'limit': None if premium else FREE_PLAYLISTS_LIMIT,
        },
    }


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def premium_status(request):
    """Показати поточний план користувача."""
    return Response(build_status(request.user))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def premium_activate(request):
    """Оформити Premium на 30 днів. ДЕМО: без оплати."""
    Subscription.objects.update_or_create(
        user=request.user,
        defaults={'expires_at': timezone.now() + timedelta(days=30)},
    )
    return Response(build_status(request.user))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def premium_cancel(request):
    """Скасувати Premium (повернути Free)."""
    Subscription.objects.filter(user=request.user).delete()
    return Response(build_status(request.user))