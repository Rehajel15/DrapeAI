from django.test import TestCase, override_settings


class HealthEndpointTests(TestCase):
    def test_returns_ok(self):
        response = self.client.get('/api/health/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')

    @override_settings(CORS_ALLOWED_ORIGINS=['http://localhost:8081'])
    def test_allows_expo_web_origin(self):
        response = self.client.get('/api/health/', HTTP_ORIGIN='http://localhost:8081')

        self.assertEqual(response['Access-Control-Allow-Origin'], 'http://localhost:8081')
