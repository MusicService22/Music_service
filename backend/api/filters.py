import django_filters

from .models import Track


class TrackFilter(django_filters.FilterSet):
    """
    Фільтрація треків:
      /api/tracks/?artist=3
      /api/tracks/?album=5
      /api/tracks/?genre=rock              (без урахування регістру, частковий збіг)
      /api/tracks/?min_duration=120&max_duration=300
    Пошук (окремо, через SearchFilter): /api/tracks/?search=назва
    """

    genre = django_filters.CharFilter(field_name='genre', lookup_expr='icontains')
    min_duration = django_filters.NumberFilter(field_name='duration_seconds', lookup_expr='gte')
    max_duration = django_filters.NumberFilter(field_name='duration_seconds', lookup_expr='lte')

    class Meta:
        model = Track
        fields = ['artist', 'album', 'genre', 'min_duration', 'max_duration']
