from django.test import TestCase
from rest_framework.test import APIClient

from .models import Artist, Track


class HealthCheckTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_returns_ok(self):
        response = self.client.get('/api/health/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})


class CatalogApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.artist = Artist.objects.create(name='Test Artist')
        self.track = Track.objects.create(
            title='Test Track',
            artist=self.artist,
            duration_seconds=180,
        )

    def test_artists_list_is_available_without_auth(self):
        response = self.client.get('/api/artists/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['name'], self.artist.name)

    def test_tracks_list_is_available_without_auth(self):
        response = self.client.get('/api/tracks/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['title'], self.track.title)
