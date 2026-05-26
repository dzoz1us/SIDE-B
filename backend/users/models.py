from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Role(models.TextChoices):
        CUSTOMER = 'customer', 'Покупатель'
        MANAGER = 'manager', 'Менеджер'
        ADMIN = 'admin', 'Администратор'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
    )

    def __str__(self):
        return f'{self.email} ({self.get_role_display()})'

    @property
    def is_customer(self):
        return self.role == self.Role.CUSTOMER

    @property
    def is_manager(self):
        return self.role == self.Role.MANAGER or self.role == self.Role.ADMIN

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN
    
class ActionLog(models.Model):
    class ActionType(models.TextChoices):
        CREATE = 'create', 'Создание'
        UPDATE = 'update', 'Редактирование'
        DELETE = 'delete', 'Удаление'
        BLOCK = 'block', 'Блокировка'
        UNBLOCK = 'unblock', 'Разблокировка'
        SALE = 'sale', 'Продажа'
        BOOK = 'book', 'Бронирование'
        CANCEL = 'cancel', 'Отмена брони'
        EXPIRE = 'expire', 'Просрочка брони'
        COMPLETE = 'complete', 'Выдача заказа'
        OTHER = 'other', 'Прочее'

    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='action_logs')
    action = models.CharField(max_length=50, choices=ActionType.choices, default=ActionType.OTHER)
    object_type = models.CharField(max_length=100, blank=True)
    object_id = models.IntegerField(null=True, blank=True)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} — {self.action} ({self.object_type})'