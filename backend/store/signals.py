from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Reservation, ReservationStatus


@receiver(post_save, sender=Reservation)
def update_stock_on_reservation(sender, instance, created, **kwargs):
    with transaction.atomic():
        if created:
            # Новая бронь: уменьшаем остаток
            instance.record.stock_quantity -= 1
            instance.record.save(update_fields=['stock_quantity'])


@receiver(post_save, sender=Reservation)
def return_stock_on_cancel_or_expire(sender, instance, created, **kwargs):
    if not created and instance.status.name in ['cancelled', 'expired']:
        # Проверяем, что статус действительно изменился
        old_instance = sender.objects.filter(pk=instance.pk).first()
        if old_instance and old_instance.status.name == 'active':
            instance.record.stock_quantity += 1
            instance.record.save(update_fields=['stock_quantity'])


@receiver(post_save, sender=Reservation)
def update_sales_on_complete(sender, instance, created, **kwargs):
    if not created and instance.status.name == 'completed':
        old_instance = sender.objects.filter(pk=instance.pk).first()
        if old_instance and old_instance.status.name == 'active':
            instance.record.sold_current_year += 1
            instance.record.save(update_fields=['sold_current_year'])