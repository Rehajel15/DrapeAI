from django.test import TestCase

from .models import User

SIGNUP_URL = '/api/auth/signup/'


class SignupTests(TestCase):
    payload = {
        'name': 'Andrea',
        'age': 27,
        'email': 'andrea@example.com',
        'password': 'runway-ready-2026',
    }

    def signup(self, **overrides):
        data = {**self.payload, **overrides}
        return self.client.post(SIGNUP_URL, data, content_type='application/json')

    def test_creates_account(self):
        response = self.signup()

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email='andrea@example.com')
        self.assertEqual(
            response.json(),
            {'id': user.id, 'name': 'Andrea', 'age': 27, 'email': 'andrea@example.com'},
        )
        self.assertEqual(user.first_name, 'Andrea')
        self.assertEqual(user.age, 27)
        self.assertFalse(user.is_staff)

    def test_stores_password_as_hash(self):
        self.signup()

        user = User.objects.get(email='andrea@example.com')
        self.assertNotEqual(user.password, self.payload['password'])
        self.assertTrue(user.check_password(self.payload['password']))

    def test_stores_email_in_lowercase(self):
        response = self.signup(email='Andrea@Example.COM')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['email'], 'andrea@example.com')

    def test_rejects_duplicate_email(self):
        self.signup()

        response = self.signup(email='ANDREA@example.com')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {'email': ['An account with this email already exists.']}
        )
        self.assertEqual(User.objects.count(), 1)

    def test_rejects_invalid_email(self):
        response = self.signup(email='not-an-email')

        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.json())

    def test_rejects_weak_password(self):
        for password in ['short', '12345678', 'password']:
            with self.subTest(password=password):
                response = self.signup(password=password)

                self.assertEqual(response.status_code, 400)
                self.assertIn('password', response.json())
        self.assertEqual(User.objects.count(), 0)

    def test_rejects_implausible_age(self):
        for age in [0, 121, 'old']:
            with self.subTest(age=age):
                response = self.signup(age=age)

                self.assertEqual(response.status_code, 400)
                self.assertIn('age', response.json())

    def test_rejects_blank_name(self):
        response = self.signup(name='   ')

        self.assertEqual(response.status_code, 400)
        self.assertIn('name', response.json())

    def test_rejects_get(self):
        response = self.client.get(SIGNUP_URL)

        self.assertEqual(response.status_code, 405)


class UserManagerTests(TestCase):
    def test_create_superuser(self):
        admin = User.objects.create_superuser('Admin@Example.com', 'runway-ready-2026')

        self.assertEqual(admin.email, 'admin@example.com')
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_requires_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user('', 'runway-ready-2026')


class UserAdminTests(TestCase):
    def test_admin_pages_load(self):
        admin = User.objects.create_superuser('admin@example.com', 'runway-ready-2026')
        self.client.force_login(admin)

        for url in [
            '/admin/accounts/user/',
            '/admin/accounts/user/add/',
            f'/admin/accounts/user/{admin.pk}/change/',
        ]:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 200)
