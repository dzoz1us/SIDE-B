from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import CustomUser
from music.models import Ensemble
from store.models import Branch, Record


class PublicAPITest(TestCase):
    """Тесты публичных эндпоинтов (без авторизации)"""

    def setUp(self):
        self.client = APIClient()
        self.ensemble = Ensemble.objects.create(name='Test', type='Rock')
        self.branch = Branch.objects.create(name='Test', address='Addr')
        self.record = Record.objects.create(
            catalogue_number='T-001', title='Test', ensemble=self.ensemble,
            retail_price=1000, wholesale_price=500, stock_quantity=10,
            branch=self.branch,
        )

    def test_get_ensembles(self):
        """Получение списка ансамблей"""
        url = reverse('ensemble-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_records(self):
        """Получение списка пластинок"""
        url = reverse('record-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_top_sellers(self):
        """Получение лидеров продаж"""
        url = reverse('record-top-sellers')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AuthenticatedAPITest(TestCase):
    """Тесты с авторизацией"""

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='t@t.ru', email='t@t.ru', password='test123',
            role=CustomUser.Role.CUSTOMER
        )
        self.admin = CustomUser.objects.create_user(
            username='a@t.ru', email='a@t.ru', password='test123',
            role=CustomUser.Role.ADMIN
        )
        self.branch = Branch.objects.create(name='Test', address='Addr')
        self.ensemble = Ensemble.objects.create(name='Test', type='Rock')
        self.record = Record.objects.create(
            catalogue_number='T-002', title='Test', ensemble=self.ensemble,
            retail_price=1000, wholesale_price=500, stock_quantity=5,
            branch=self.branch,
        )

    def test_login_returns_tokens(self):
        """Вход возвращает access и refresh токены"""
        url = reverse('login')
        response = self.client.post(url, {'email': 't@t.ru', 'password': 'test123'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_register_creates_user(self):
        """Регистрация создаёт пользователя"""
        url = reverse('register')
        response = self.client.post(url, {
            'email': 'new@t.ru', 'password': 'newpass123',
            'first_name': 'New', 'last_name': 'User'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_cannot_access_admin(self):
        """Обычный пользователь не может создавать ансамбли"""
        self.client.force_authenticate(user=self.user)
        url = reverse('ensemble-list')
        response = self.client.post(url, {'name': 'Test'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)