from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Album, Artist, Favorite, Playlist, PlaylistTrack, Track, UserProfile


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
        self.user = get_user_model().objects.create_user(username='listener', password='password123')
        self.artist = Artist.objects.create(name='Test Artist')
        self.album = Album.objects.create(title='Test Album', artist=self.artist)
        self.track = Track.objects.create(
            title='Test Track',
            artist=self.artist,
            album=self.album,
            duration_seconds=180,
        )
        self.playlist = Playlist.objects.create(user=self.user, name='Test Playlist')
        PlaylistTrack.objects.create(playlist=self.playlist, track=self.track, position=1)
        Favorite.objects.create(user=self.user, track=self.track)
        self.other_user = get_user_model().objects.create_user(username='other-listener', password='password123')
        self.other_playlist = Playlist.objects.create(user=self.other_user, name='Other Playlist')

    def test_artists_list_is_available_without_auth(self):
        response = self.client.get('/api/artists/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['name'], self.artist.name)

    def test_tracks_list_is_available_without_auth(self):
        response = self.client.get('/api/tracks/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['title'], self.track.title)

    def test_albums_list_is_available_without_auth(self):
        response = self.client.get('/api/albums/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['title'], self.album.title)

    def test_public_playlists_list_is_available_without_auth(self):
        response = self.client.get('/api/playlists/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['name'], self.playlist.name)

    def test_authenticated_user_can_list_own_favorites(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get('/api/favorites/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['track']['title'], self.track.title)

    def test_authenticated_user_cannot_update_another_users_public_playlist(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(
            f'/api/playlists/{self.other_playlist.id}/',
            {'name': 'Renamed by someone else'},
            format='json',
        )
        self.other_playlist.refresh_from_db()

        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.other_playlist.name, 'Other Playlist')

    def test_duplicate_playlist_name_returns_validation_error(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/api/playlists/', {'name': self.playlist.name}, format='json')

        self.assertEqual(response.status_code, 400)

    def test_duplicate_favorite_returns_validation_error(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/api/favorites/', {'track_id': self.track.id}, format='json')

        self.assertEqual(response.status_code, 400)


class CurrentUserApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='listener',
            email='listener@example.com',
            password='password123',
        )
        UserProfile.objects.create(user=self.user, display_name='Test Listener')

    def test_me_requires_authentication(self):
        response = self.client.get('/api/me/')

        self.assertEqual(response.status_code, 401)

    def test_me_returns_current_user_and_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get('/api/me/')
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['id'], self.user.id)
        self.assertEqual(data['username'], self.user.username)
        self.assertEqual(data['email'], self.user.email)
        self.assertEqual(data['profile']['display_name'], 'Test Listener')

    def test_duplicate_profile_returns_validation_error(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/api/profiles/', {'display_name': 'Duplicate'}, format='json')

        self.assertEqual(response.status_code, 400)
