from django.core.management.base import BaseCommand
from users.models import CustomUser
from store.models import ReservationStatus, Branch, Record, Track
from music.models import Ensemble, Musician, Participation, Composition


class Command(BaseCommand):
    help = 'Создание начальных данных'

    def handle(self, *args, **kwargs):
        # Статусы брони
        for name in ['active', 'completed', 'expired', 'cancelled']:
            ReservationStatus.objects.get_or_create(name=name)

        # Администратор
        if not CustomUser.objects.filter(email='admin@vinyl.ru').exists():
            admin = CustomUser.objects.create_superuser(
                username='admin@vinyl.ru',
                email='admin@vinyl.ru',
                password='admin123',
                role=CustomUser.Role.ADMIN,
                first_name='Админ',
                last_name='Главный',
            )
            self.stdout.write(f'Администратор создан: admin@vinyl.ru / admin123')

        # Филиалы
        branches_data = [
            {'name': 'ВинилВолт на Арбате', 'address': 'Москва, ул. Арбат, д. 15', 'phone': '+7 (495) 111-11-11', 'opening_hours': '10:00–22:00'},
            {'name': 'ВинилВолт на Тверской', 'address': 'Москва, ул. Тверская, д. 8', 'phone': '+7 (495) 222-22-22', 'opening_hours': '11:00–23:00'},
        ]
        branches = {}
        for b in branches_data:
            branch, _ = Branch.objects.get_or_create(name=b['name'], defaults=b)
            branches[b['name']] = branch

        # Ансамбли
        ensembles_data = [
            {'name': 'The Midnight Riders', 'type': 'Рок-группа', 'founded': 2010, 'country': 'США',
             'description': 'Легендарная рок-группа, покоряющая сердца энергичными риффами и глубокими текстами.',
             'image': 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'},
            {'name': 'Electric Dreams', 'type': 'Электронная музыка', 'founded': 2014, 'country': 'Великобритания',
             'description': 'Пионеры синти-попа, смешивающие ретро-звучание с современными битами.',
             'image': 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'},
            {'name': 'Jazz Collective', 'type': 'Джаз', 'founded': 2001, 'country': 'Франция',
             'description': 'Новаторы джазовой сцены, объединяющие классический джаз с этническими мотивами.',
             'image': 'https://images.pexels.com/photos/2909822/pexels-photo-2909822.jpeg'},
            {'name': 'Neon Pulse', 'type': 'Электронная музыка', 'founded': 2019, 'country': 'Япония',
             'description': 'Футуристичное электронное звучание с элементами J-pop и аниме-саундтреков.',
             'image': 'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg'},
            {'name': 'Desert Storm', 'type': 'Рок-группа', 'founded': 2005, 'country': 'Австралия',
             'description': 'Тяжёлые рифы пустынного рока, вдохновлённые бескрайними просторами Австралии.',
             'image': 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg'},
            {'name': 'Blue Monday Orchestra', 'type': 'Оркестр', 'founded': 2003, 'country': 'Германия',
             'description': 'Симфонический оркестр, исполняющий современную классику и саундтреки.',
             'image': 'https://images.pexels.com/photos/2098134/pexels-photo-2098134.jpeg'},
            {'name': 'Acoustic Soul', 'type': 'Ансамбль', 'founded': 2010, 'country': 'США',
             'description': 'Душевный акустический соул с тёплыми гармониями.',
             'image': 'https://images.pexels.com/photos/2378208/pexels-photo-2378208.jpeg'},
        ]
        ensembles = {}
        for e in ensembles_data:
            ensemble, created = Ensemble.objects.get_or_create(name=e['name'], defaults=e)
            ensembles[e['name']] = ensemble

        # Музыканты
        musicians_data = [
            {'first_name': 'Джейк', 'last_name': 'Райдер', 'instruments': 'Вокал, Гитара'},
            {'first_name': 'Майк', 'last_name': 'Сторм', 'instruments': 'Бас-гитара'},
            {'first_name': 'Алекс', 'last_name': 'Драммонд', 'instruments': 'Ударные'},
            {'first_name': 'София', 'last_name': 'Электро', 'instruments': 'Синтезатор, Вокал'},
            {'first_name': 'Люк', 'last_name': 'Дюпон', 'instruments': 'Саксофон'},
            {'first_name': 'Юки', 'last_name': 'Танака', 'instruments': 'Синтезатор, Драм-машина'},
            {'first_name': 'Макс', 'last_name': 'Роквелл', 'instruments': 'Гитара, Вокал'},
            {'first_name': 'Ханс', 'last_name': 'Циммерман', 'instruments': 'Скрипка, Дирижёр'},
            {'first_name': 'Эмма', 'last_name': 'Соул', 'instruments': 'Вокал, Акустическая гитара'},
            {'first_name': 'Томми', 'last_name': 'Блюз', 'instruments': 'Губная гармошка, Вокал'},
        ]
        musicians = {}
        for m in musicians_data:
            musician, _ = Musician.objects.get_or_create(
                first_name=m['first_name'], last_name=m['last_name'],
                defaults={'instruments': m['instruments']}
            )
            musicians[f"{m['first_name']} {m['last_name']}"] = musician

        # Связи: ансамбль — музыкант
        participations = [
            ('The Midnight Riders', 'Джейк Райдер', 'исполнитель', 'Вокал, Гитара'),
            ('The Midnight Riders', 'Майк Сторм', 'исполнитель', 'Бас-гитара'),
            ('The Midnight Riders', 'Алекс Драммонд', 'исполнитель', 'Ударные'),
            ('Electric Dreams', 'София Электро', 'руководитель', 'Синтезатор'),
            ('Jazz Collective', 'Люк Дюпон', 'исполнитель', 'Саксофон'),
            ('Neon Pulse', 'Юки Танака', 'руководитель', 'Синтезатор'),
            ('Desert Storm', 'Макс Роквелл', 'руководитель', 'Гитара, Вокал'),
            ('Blue Monday Orchestra', 'Ханс Циммерман', 'дирижёр', 'Скрипка'),
            ('Acoustic Soul', 'Эмма Соул', 'руководитель', 'Вокал'),
            ('Acoustic Soul', 'Томми Блюз', 'исполнитель', 'Губная гармошка'),
        ]
        for ens_name, mus_name, role, inst in participations:
            Participation.objects.get_or_create(
                ensemble=ensembles[ens_name],
                musician=musicians[mus_name],
                role=role,
                instrument=inst,
            )

        # Произведения
        compositions_data = [
            {'title': 'Midnight Stories', 'duration': 285},
            {'title': 'Electric Highway', 'duration': 312},
            {'title': 'Beyond the Horizon', 'duration': 267},
            {'title': 'Synthwave Nights', 'duration': 298},
            {'title': 'Blue Notes', 'duration': 340},
            {'title': 'Neon Tokyo', 'duration': 276},
            {'title': 'Desert Wind', 'duration': 254},
            {'title': 'Symphony of Lights', 'duration': 420},
            {'title': 'Acoustic Morning', 'duration': 198},
        ]
        compositions = {}
        for c in compositions_data:
            comp, _ = Composition.objects.get_or_create(title=c['title'], defaults={'duration': c['duration']})
            compositions[c['title']] = comp

        # Пластинки
        records_data = [
            {'catalogue_number': 'MR-001', 'title': 'Midnight Stories', 'ensemble': 'The Midnight Riders',
             'label': 'Rock Records', 'release_date': '2020-01-15', 'wholesale_price': 1200, 'retail_price': 2499,
             'stock_quantity': 15, 'sold_current_year': 15420,
             'cover_image': 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg'},
            {'catalogue_number': 'MR-002', 'title': 'Electric Highway', 'ensemble': 'The Midnight Riders',
             'label': 'Rock Records', 'release_date': '2021-03-20', 'wholesale_price': 1100, 'retail_price': 2299,
             'stock_quantity': 10, 'sold_current_year': 8920,
             'cover_image': 'https://images.pexels.com/photos/2746823/pexels-photo-2746823.jpeg'},
            {'catalogue_number': 'ED-001', 'title': 'Synthwave Nights', 'ensemble': 'Electric Dreams',
             'label': 'Neon Records', 'release_date': '2018-06-10', 'wholesale_price': 1000, 'retail_price': 2199,
             'stock_quantity': 8, 'sold_current_year': 12380,
             'cover_image': 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg'},
            {'catalogue_number': 'JC-001', 'title': 'Blue Notes', 'ensemble': 'Jazz Collective',
             'label': 'Blue Note', 'release_date': '2005-09-15', 'wholesale_price': 1500, 'retail_price': 2999,
             'stock_quantity': 5, 'sold_current_year': 9850,
             'cover_image': 'https://images.pexels.com/photos/2150/music-black-and-white-lp-vinyl.jpg'},
            {'catalogue_number': 'NP-001', 'title': 'Neon Tokyo', 'ensemble': 'Neon Pulse',
             'label': 'Tokyo Beats', 'release_date': '2020-11-01', 'wholesale_price': 1300, 'retail_price': 2599,
             'stock_quantity': 7, 'sold_current_year': 7200,
             'cover_image': 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg'},
            {'catalogue_number': 'DS-001', 'title': 'Desert Wind', 'ensemble': 'Desert Storm',
             'label': 'Outback Records', 'release_date': '2008-02-28', 'wholesale_price': 900, 'retail_price': 1899,
             'stock_quantity': 3, 'sold_current_year': 5100,
             'cover_image': 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg'},
            {'catalogue_number': 'BO-001', 'title': 'Symphony of Lights', 'ensemble': 'Blue Monday Orchestra',
             'label': 'Classic Records', 'release_date': '2015-12-01', 'wholesale_price': 2000, 'retail_price': 3999,
             'stock_quantity': 4, 'sold_current_year': 3400,
             'cover_image': 'https://images.pexels.com/photos/159376/symphony-orchestra-performing-on-stage-159376.jpeg'},
            {'catalogue_number': 'AS-001', 'title': 'Acoustic Morning', 'ensemble': 'Acoustic Soul',
             'label': 'Soulful Records', 'release_date': '2013-05-20', 'wholesale_price': 800, 'retail_price': 1699,
             'stock_quantity': 6, 'sold_current_year': 6800,
             'cover_image': 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg'},
        ]
        for r in records_data:
            record, created = Record.objects.get_or_create(
                catalogue_number=r['catalogue_number'],
                defaults={
                    'title': r['title'],
                    'ensemble': ensembles[r['ensemble']],
                    'label': r['label'],
                    'release_date': r['release_date'],
                    'wholesale_price': r['wholesale_price'],
                    'retail_price': r['retail_price'],
                    'stock_quantity': r['stock_quantity'],
                    'sold_current_year': r['sold_current_year'],
                    'cover_image': r['cover_image'],
                    'branch': list(branches.values())[0],
                }
            )

        # Треки
        tracks_data = [
            ('Midnight Stories', 'Midnight Stories', 1),
            ('Midnight Stories', 'Electric Highway', 2),
            ('Electric Highway', 'Electric Highway', 1),
            ('Synthwave Nights', 'Synthwave Nights', 1),
            ('Blue Notes', 'Blue Notes', 1),
            ('Neon Tokyo', 'Neon Tokyo', 1),
            ('Desert Wind', 'Desert Wind', 1),
            ('Symphony of Lights', 'Symphony of Lights', 1),
            ('Acoustic Morning', 'Acoustic Morning', 1),
        ]
        for record_title, comp_title, track_num in tracks_data:
            record = Record.objects.get(title=record_title)
            comp = compositions[comp_title]
            Track.objects.get_or_create(record=record, composition=comp, track_number=track_num)

        self.stdout.write(self.style.SUCCESS('✅ Начальные данные созданы: 7 ансамблей, 10 музыкантов, 8 пластинок'))