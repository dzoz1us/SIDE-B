from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import ActionLog
from store.models import Record, Reservation
from music.models import Ensemble, Musician

UserModel = get_user_model()


def log_action(user, action, object_type, object_id=None, details=''):
    ActionLog.objects.create(
        user=user,
        action=action,
        object_type=object_type,
        object_id=object_id,
        details=details,
    )


# Логирование создания/изменения пластинок
@receiver(post_save, sender=Record)
def log_record_save(sender, instance, created, **kwargs):
    # Определяем пользователя (если есть request)
    action = 'create' if created else 'update'
    log_action(
        user=None,
        action=action,
        object_type='Record',
        object_id=instance.id,
        details=f'Пластинка: {instance.title}',
    )


# Логирование удаления пластинок
@receiver(post_delete, sender=Record)
def log_record_delete(sender, instance, **kwargs):
    log_action(
        user=None,
        action='delete',
        object_type='Record',
        object_id=instance.id,
        details=f'Пластинка: {instance.title}',
    )


# Логирование броней
@receiver(post_save, sender=Reservation)
def log_reservation(sender, instance, created, **kwargs):
    if created:
        log_action(
            user=instance.user,
            action='book',
            object_type='Reservation',
            object_id=instance.id,
            details=f'Пластинка: {instance.record.title}',
        )
    elif instance.status.name == 'cancelled':
        log_action(
            user=instance.user,
            action='cancel',
            object_type='Reservation',
            object_id=instance.id,
            details=f'Пластинка: {instance.record.title}',
        )
    elif instance.status.name == 'completed':
        log_action(
            user=None,
            action='complete',
            object_type='Reservation',
            object_id=instance.id,
            details=f'Пластинка: {instance.record.title}',
        )
    elif instance.status.name == 'expired':
        log_action(
            user=None,
            action='expire',
            object_type='Reservation',
            object_id=instance.id,
            details=f'Пластинка: {instance.record.title}',
        )