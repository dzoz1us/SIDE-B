from django.test import TestCase
from django.utils import timezone
from datetime import timedelta


class RecordModelTest(TestCase):
    def setUp(self):
        from users.models import CustomUser
        from store.models import Branch
        from music.models import Ensemble
        self.branch = Branch.objects.create(name='Филиал', address='Адрес')
        self.ensemble = Ensemble.objects.create(name='Ансамбль', type='Рок')

    def test_record_creation(self):
        from store.models import Record
        record = Record.objects.create(
            catalogue_number='T-001', title='Альбом', ensemble=self.ensemble,
            retail_price=1000, wholesale_price=500, stock_quantity=10,
            branch=self.branch,
        )
        self.assertEqual(record.title, 'Альбом')


class ReservationModelTest(TestCase):
    def setUp(self):
        from users.models import CustomUser
        from store.models import Branch, ReservationStatus
        from music.models import Ensemble
        self.user = CustomUser.objects.create_user(
            username='t@t.ru', email='t@t.ru', password='test',
            role=CustomUser.Role.ADMIN
        )
        self.branch = Branch.objects.create(name='Филиал', address='Адрес')
        self.ensemble = Ensemble.objects.create(name='Ансамбль', type='Рок')
        ReservationStatus.objects.get_or_create(name='active')

    def test_reservation_creation(self):
        from store.models import Record, Reservation, ReservationStatus
        from django.utils import timezone
        from datetime import timedelta
        
        record = Record.objects.create(
            catalogue_number='T-RES', title='Альбом', ensemble=self.ensemble,
            retail_price=500, wholesale_price=250, stock_quantity=3,
            branch=self.branch,
        )
        status = ReservationStatus.objects.get(name='active')
        reservation = Reservation.objects.create(
            user=self.user, record=record, branch=self.branch, status=status,
            expires_at=timezone.now() + timedelta(hours=48)  # ← добавили
        )
        self.assertEqual(reservation.status.name, 'active')


class UserRoleTest(TestCase):
    def test_admin_permissions(self):
        from users.models import CustomUser
        admin = CustomUser.objects.create_user(
            username='adm@t.ru', email='adm@t.ru', password='test',
            role=CustomUser.Role.ADMIN
        )
        self.assertTrue(admin.is_admin)

    def test_customer_permissions(self):
        from users.models import CustomUser
        customer = CustomUser.objects.create_user(
            username='cust@t.ru', email='cust@t.ru', password='test',
            role=CustomUser.Role.CUSTOMER
        )
        self.assertTrue(customer.is_customer)