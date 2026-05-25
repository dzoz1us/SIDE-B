import type { Ensemble, Musician, EnsembleMember, Composition, Track, Branch, VinylRecord, RecordBranch, AppUser, Booking, ActionLog } from "../types";

export const INIT_ENSEMBLES: Ensemble[] = [
  {
    id: 1, name: "Квартет Шостаковича", type: "Квартет", country: "Россия", founded: 1946,
    description: "Один из старейших и наиболее уважаемых квартетов России, специализирующийся на русском камерном репертуаре.",
    bio: "Квартет Шостаковича основан в 1946 году в Ленинграде. За десятилетия работы ансамбль дал тысячи концертов по всему миру и записал полное собрание квартетов Шостаковича, ставшее эталонным. Коллектив является лауреатом множества государственных премий и регулярно выступает в ведущих концертных залах Европы и Азии.",
    photo: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=500&fit=crop&auto=format",
    albumCount: 24, memberCount: 4,
  },
  {
    id: 2, name: "Московский Джаз-Бэнд", type: "Джаз-банд", country: "Россия", founded: 1971,
    description: "Легендарный джазовый коллектив, сформировавший облик советского и российского джаза.",
    bio: "Московский Джаз-Бэнд основан в 1971 году саксофонистом Аркадием Козловым. Коллектив стал одним из первых легально признанных джазовых ансамблей в СССР. Репертуар включает классический американский джаз и авторские композиции с элементами русской музыки.",
    photo: "https://images.unsplash.com/photo-1511379938547-c1f1227d3994?w=800&h=500&fit=crop&auto=format",
    albumCount: 18, memberCount: 7,
  },
  {
    id: 3, name: "The Vinyl Rockets", type: "Рок-группа", country: "Великобритания", founded: 1988,
    description: "Культовая британская рок-группа, вдохновлённая классическим хард-роком 60–70-х годов.",
    bio: "The Vinyl Rockets сформировались в Манчестере в 1988 году. Группа быстро завоевала репутацию одного из самых энергичных живых концертных актов Британии. Их музыка сочетает тяжёлые гитарные рифы с мелодичными линиями классического рок-н-ролла.",
    photo: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop&auto=format",
    albumCount: 12, memberCount: 4,
  },
  {
    id: 4, name: "Симфонический Оркестр Петербурга", type: "Оркестр", country: "Россия", founded: 1882,
    description: "Один из старейших симфонических оркестров мира, хранитель традиций русской классической музыки.",
    bio: "Симфонический оркестр Санкт-Петербурга ведёт историю с 1882 года. Коллектив насчитывает более 120 музыкантов и регулярно выступает в Большом зале Санкт-Петербургской Филармонии. Дискография включает полные собрания симфоний Чайковского, Прокофьева и Рахманинова.",
    photo: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop&auto=format",
    albumCount: 67, memberCount: 120,
  },
  {
    id: 5, name: "Blue Note Trio", type: "Джаз-банд", country: "США", founded: 2003,
    description: "Современное джазовое трио из Нью-Йорка, исследующее пространство между бопом и авангардом.",
    bio: "Blue Note Trio образовался в 2003 году на джазовой сцене Нью-Йорка. Состоит из трёх виртуозов-импровизаторов. Коллектив выпустил восемь студийных альбомов и активно гастролирует по всему миру.",
    photo: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop&auto=format",
    albumCount: 8, memberCount: 3,
  },
  {
    id: 6, name: "Камерный Оркестр «Арпеджио»", type: "Камерный оркестр", country: "Германия", founded: 1995,
    description: "Немецкий камерный оркестр, специализирующийся на барочной музыке на аутентичных инструментах.",
    bio: "Оркестр «Арпеджио» основан в 1995 году в Лейпциге дирижёром Клаусом Вебером. Ансамбль исполняет барочный репертуар на инструментах эпохи. Лауреат множества международных премий.",
    photo: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=500&fit=crop&auto=format",
    albumCount: 15, memberCount: 18,
  },
];

export const INIT_MUSICIANS: Musician[] = [
  { id: 1, firstName: "Алексей", lastName: "Воронов", birthDate: "1952-03-15", instruments: ["Скрипка"], bio: "Народный артист России, один из ведущих скрипачей своего поколения. Окончил Московскую консерваторию, лауреат конкурса имени Чайковского.", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format" },
  { id: 2, firstName: "Марина", lastName: "Соколова", birthDate: "1958-07-22", instruments: ["Скрипка"], bio: "Окончила Московскую консерваторию с золотой медалью. Сольная карьера включает выступления в Карнеги-холле и Ройял-Альберт-холле.", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&auto=format" },
  { id: 3, firstName: "Пётр", lastName: "Захаров", birthDate: "1960-11-08", instruments: ["Альт"], bio: "Альтист с мировым именем, лауреат международных конкурсов. Педагог Санкт-Петербургской консерватории.", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format" },
  { id: 4, firstName: "Наталья", lastName: "Борисова", birthDate: "1955-04-30", instruments: ["Виолончель"], bio: "Виолончелистка, профессор Санкт-Петербургской консерватории. Записала более 40 дисков.", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format" },
  { id: 5, firstName: "Аркадий", lastName: "Козлов", birthDate: "1948-09-12", instruments: ["Саксофон", "Кларнет"], bio: "Основатель Московского Джаз-Бэнда, легенда советского джаза. Автор более 200 оригинальных композиций.", photo: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=300&h=300&fit=crop&auto=format" },
  { id: 6, firstName: "Ирина", lastName: "Смирнова", birthDate: "1962-01-25", instruments: ["Фортепиано"], bio: "Пианистка, лауреат конкурса имени Чайковского. Сочетает джаз и академическую традицию.", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&auto=format" },
  { id: 7, firstName: "Джеймс", lastName: "Харрисон", birthDate: "1965-06-14", instruments: ["Электрогитара", "Вокал"], bio: "Основатель и гитарист The Vinyl Rockets. Вдохновлён Джимми Пейджем и Тони Айомми.", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&auto=format" },
  { id: 8, firstName: "Маркус", lastName: "Бауэр", birthDate: "1970-02-18", instruments: ["Контрабас"], bio: "Один из ведущих джазовых контрабасистов современности. Участник Blue Note Trio и Московского Джаз-Бэнда.", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format" },
  { id: 9, firstName: "Сара", lastName: "Коннор", birthDate: "1975-08-05", instruments: ["Труба", "Флюгельгорн"], bio: "Трубач Blue Note Trio. Окончила Беркли, стажировалась у Уинтона Марсалиса.", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format" },
  { id: 10, firstName: "Клаус", lastName: "Вебер", birthDate: "1955-12-03", instruments: ["Дирижирование"], bio: "Дирижёр и основатель оркестра «Арпеджио». Специалист по исполнительской практике барокко.", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&auto=format" },
];

export const INIT_MEMBERS: EnsembleMember[] = [
  { id: 1, ensembleId: 1, musicianId: 1, role: "Исполнитель", instrument: "Скрипка I", from: 1946 },
  { id: 2, ensembleId: 1, musicianId: 2, role: "Исполнитель", instrument: "Скрипка II", from: 1968 },
  { id: 3, ensembleId: 1, musicianId: 3, role: "Исполнитель", instrument: "Альт", from: 1972 },
  { id: 4, ensembleId: 1, musicianId: 4, role: "Исполнитель", instrument: "Виолончель", from: 1975 },
  { id: 5, ensembleId: 2, musicianId: 5, role: "Руководитель", instrument: "Саксофон", from: 1971 },
  { id: 6, ensembleId: 2, musicianId: 6, role: "Исполнитель", instrument: "Фортепиано", from: 1975 },
  { id: 7, ensembleId: 2, musicianId: 8, role: "Исполнитель", instrument: "Контрабас", from: 1982 },
  { id: 8, ensembleId: 3, musicianId: 7, role: "Руководитель", instrument: "Электрогитара", from: 1988 },
  { id: 9, ensembleId: 5, musicianId: 9, role: "Исполнитель", instrument: "Труба", from: 2003 },
  { id: 10, ensembleId: 5, musicianId: 8, role: "Исполнитель", instrument: "Контрабас", from: 2003 },
  { id: 11, ensembleId: 6, musicianId: 10, role: "Дирижёр", instrument: "", from: 1995 },
];

export const INIT_COMPOSITIONS: Composition[] = [
  { id: 1, title: "Квартет №8 ре минор, op.110", compositorId: 1, duration: "25:30" },
  { id: 2, title: "Квартет №10 ля-бемоль мажор, op.118", compositorId: 2, duration: "22:15" },
  { id: 3, title: "Московские ночи (джаз-версия)", compositorId: 5, duration: "6:45" },
  { id: 4, title: "Скиталец", compositorId: 5, duration: "8:20" },
  { id: 5, title: "Полночный экспресс", compositorId: 5, duration: "5:55" },
  { id: 6, title: "Thunder Road", compositorId: 7, duration: "4:32" },
  { id: 7, title: "Midnight Echo", compositorId: 7, duration: "5:18" },
  { id: 8, title: "Iron Horizon", compositorId: 7, duration: "6:02" },
  { id: 9, title: "Симфония №6 «Патетическая», I часть", compositorId: 4, duration: "18:00" },
  { id: 10, title: "Симфония №6 «Патетическая», IV часть", compositorId: 4, duration: "10:30" },
  { id: 11, title: "Blues for Tomorrow", compositorId: 9, duration: "7:14" },
  { id: 12, title: "Night in New York", compositorId: 9, duration: "6:50" },
  { id: 13, title: "Allegro in D", compositorId: 10, duration: "9:45" },
  { id: 14, title: "Concerto Grosso No.1", compositorId: 10, duration: "14:20" },
  { id: 15, title: "Квартет №5 соль мажор", compositorId: 2, duration: "18:40" },
];

export const INIT_BRANCHES: Branch[] = [
  { id: 1, name: "Side B — Центр", address: "Москва, ул. Арбат, 15", phone: "+7 (495) 123-45-67", hours: "Пн–Пт: 10:00–21:00, Сб–Вс: 11:00–20:00" },
  { id: 2, name: "Side B — Петербург", address: "Санкт-Петербург, Невский пр., 88", phone: "+7 (812) 987-65-43", hours: "Ежедневно: 10:00–22:00" },
  { id: 3, name: "Side B — Новосибирск", address: "Новосибирск, ул. Ленина, 23", phone: "+7 (383) 456-78-90", hours: "Пн–Вс: 11:00–20:00" },
  { id: 4, name: "Side B — Казань", address: "Казань, ул. Баумана, 7", phone: "+7 (843) 321-09-87", hours: "Пн–Сб: 10:00–20:00, Вс: 12:00–18:00" },
  { id: 5, name: "Side B — Екатеринбург", address: "Екатеринбург, пр. Ленина, 50", phone: "+7 (343) 111-22-33", hours: "Пн–Пт: 10:00–21:00, Сб–Вс: 10:00–19:00" },
];

export const INIT_RECORDS: VinylRecord[] = [
  { id: 1, title: "Квартеты Шостаковича Vol.1", ensembleId: 1, year: 1978, label: "Мелодия", catalogNumber: "C10-12345", price: 2400, wholesalePrice: 1200, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 142, genre: "Классика", supplier: "ООО «АудиоИмпорт», Москва" },
  { id: 2, title: "Ночи на Арбате", ensembleId: 2, year: 1975, label: "Мелодия", catalogNumber: "C10-23456", price: 2100, wholesalePrice: 900, cover: "https://images.unsplash.com/photo-1584679109597-c656b19974c9?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 208, genre: "Джаз", supplier: "ООО «АудиоИмпорт», Москва" },
  { id: 3, title: "High Voltage", ensembleId: 3, year: 1992, label: "Island Records", catalogNumber: "VR-1992-01", price: 3200, wholesalePrice: 1600, cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 87, genre: "Рок", supplier: "BritSound Ltd, London" },
  { id: 4, title: "Патетическая симфония", ensembleId: 4, year: 1965, label: "Deutsche Grammophon", catalogNumber: "DG-139036", price: 4500, wholesalePrice: 2200, cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 321, genre: "Классика", supplier: "Deutsche Grammophon GmbH" },
  { id: 5, title: "Blue Miles", ensembleId: 5, year: 2008, label: "Blue Note", catalogNumber: "BN-2008-14", price: 2800, wholesalePrice: 1300, cover: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 156, genre: "Джаз", supplier: "Blue Note Records, New York" },
  { id: 6, title: "Bach: Brandenburg Concertos", ensembleId: 6, year: 2012, label: "Archiv Produktion", catalogNumber: "AP-2012-88", price: 3800, wholesalePrice: 1900, cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 98, genre: "Барокко", supplier: "Deutsche Grammophon GmbH" },
  { id: 7, title: "Квартеты Шостаковича Vol.2", ensembleId: 1, year: 1980, label: "Мелодия", catalogNumber: "C10-34567", price: 2400, wholesalePrice: 1200, cover: "https://images.unsplash.com/photo-1470019693664-ef3f3c84a88b?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 110, genre: "Классика", supplier: "ООО «АудиоИмпорт», Москва" },
  { id: 8, title: "Moscow After Dark", ensembleId: 2, year: 1983, label: "Мелодия", catalogNumber: "C10-45678", price: 1900, wholesalePrice: 800, cover: "https://images.unsplash.com/photo-1511379938547-c1f1227d3994?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 175, genre: "Джаз", supplier: "ООО «АудиоИмпорт», Москва" },
  { id: 9, title: "Thunderstruck", ensembleId: 3, year: 1996, label: "Island Records", catalogNumber: "VR-1996-02", price: 2900, wholesalePrice: 1400, cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 64, genre: "Рок", supplier: "BritSound Ltd, London" },
  { id: 10, title: "Evening Sessions", ensembleId: 5, year: 2015, label: "Blue Note", catalogNumber: "BN-2015-22", price: 3100, wholesalePrice: 1500, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format", soldCurrentYear: 93, genre: "Джаз", supplier: "Blue Note Records, New York" },
];

export const INIT_RECORD_BRANCHES: RecordBranch[] = [
  { id: 1, recordId: 1, branchId: 1, quantity: 5 },
  { id: 2, recordId: 1, branchId: 2, quantity: 3 },
  { id: 3, recordId: 1, branchId: 3, quantity: 0 },
  { id: 4, recordId: 2, branchId: 1, quantity: 2 },
  { id: 5, recordId: 2, branchId: 2, quantity: 7 },
  { id: 6, recordId: 3, branchId: 1, quantity: 1 },
  { id: 7, recordId: 3, branchId: 4, quantity: 4 },
  { id: 8, recordId: 4, branchId: 2, quantity: 8 },
  { id: 9, recordId: 4, branchId: 5, quantity: 2 },
  { id: 10, recordId: 5, branchId: 1, quantity: 3 },
  { id: 11, recordId: 5, branchId: 3, quantity: 6 },
  { id: 12, recordId: 6, branchId: 2, quantity: 4 },
  { id: 13, recordId: 6, branchId: 4, quantity: 2 },
  { id: 14, recordId: 7, branchId: 1, quantity: 0 },
  { id: 15, recordId: 7, branchId: 2, quantity: 4 },
  { id: 16, recordId: 8, branchId: 3, quantity: 3 },
  { id: 17, recordId: 8, branchId: 5, quantity: 1 },
  { id: 18, recordId: 9, branchId: 1, quantity: 2 },
  { id: 19, recordId: 9, branchId: 4, quantity: 0 },
  { id: 20, recordId: 10, branchId: 2, quantity: 5 },
  { id: 21, recordId: 10, branchId: 3, quantity: 2 },
];

export const INIT_TRACKS: Track[] = [
  { id: 1, recordId: 1, trackNumber: 1, compositionId: 1 },
  { id: 2, recordId: 1, trackNumber: 2, compositionId: 2 },
  { id: 3, recordId: 1, trackNumber: 3, compositionId: 15 },
  { id: 4, recordId: 2, trackNumber: 1, compositionId: 3 },
  { id: 5, recordId: 2, trackNumber: 2, compositionId: 4 },
  { id: 6, recordId: 2, trackNumber: 3, compositionId: 5 },
  { id: 7, recordId: 3, trackNumber: 1, compositionId: 6 },
  { id: 8, recordId: 3, trackNumber: 2, compositionId: 7 },
  { id: 9, recordId: 3, trackNumber: 3, compositionId: 8 },
  { id: 10, recordId: 4, trackNumber: 1, compositionId: 9 },
  { id: 11, recordId: 4, trackNumber: 2, compositionId: 10 },
  { id: 12, recordId: 5, trackNumber: 1, compositionId: 11 },
  { id: 13, recordId: 5, trackNumber: 2, compositionId: 12 },
  { id: 14, recordId: 6, trackNumber: 1, compositionId: 13 },
  { id: 15, recordId: 6, trackNumber: 2, compositionId: 14 },
  { id: 16, recordId: 7, trackNumber: 1, compositionId: 2 },
  { id: 17, recordId: 7, trackNumber: 2, compositionId: 1 },
  { id: 18, recordId: 8, trackNumber: 1, compositionId: 3 },
  { id: 19, recordId: 8, trackNumber: 2, compositionId: 4 },
  { id: 20, recordId: 9, trackNumber: 1, compositionId: 6 },
  { id: 21, recordId: 9, trackNumber: 2, compositionId: 8 },
  { id: 22, recordId: 10, trackNumber: 1, compositionId: 11 },
  { id: 23, recordId: 10, trackNumber: 2, compositionId: 12 },
];

export const INIT_USERS: AppUser[] = [
  { id: 1, firstName: "Иван", lastName: "Петров", email: "ivan@example.com", role: "user", status: "active", createdAt: "2024-01-15" },
  { id: 2, firstName: "Елена", lastName: "Сидорова", email: "elena@example.com", role: "user", status: "active", createdAt: "2024-02-20" },
  { id: 3, firstName: "Дмитрий", lastName: "Кузнецов", email: "dmitry@sideb.ru", role: "manager", status: "active", createdAt: "2023-11-10" },
  { id: 4, firstName: "Анна", lastName: "Новикова", email: "anna@sideb.ru", role: "manager", status: "active", createdAt: "2023-08-05" },
  { id: 5, firstName: "Сергей", lastName: "Волков", email: "admin@sideb.ru", role: "admin", status: "active", createdAt: "2022-01-01" },
];

const now = Date.now();
const h = 3600000;

export const INIT_BOOKINGS: Booking[] = [
  { id: 1001, userId: 1, recordId: 1, branchId: 1, status: "active", createdAt: new Date(now - 5 * h).toISOString(), deadline: new Date(now + 43 * h).toISOString() },
  { id: 1002, userId: 1, recordId: 4, branchId: 2, status: "active", createdAt: new Date(now - 25 * h).toISOString(), deadline: new Date(now + 23 * h).toISOString() },
  { id: 1003, userId: 1, recordId: 2, branchId: 2, status: "completed", createdAt: "2025-04-10T10:00:00", deadline: "2025-04-12T10:00:00", completedAt: "2025-04-11T14:30:00" },
  { id: 1004, userId: 1, recordId: 3, branchId: 1, status: "cancelled", createdAt: "2025-03-20T15:00:00", deadline: "2025-03-22T15:00:00" },
  { id: 1005, userId: 1, recordId: 5, branchId: 3, status: "expired", createdAt: "2025-02-01T09:00:00", deadline: "2025-02-03T09:00:00" },
  { id: 1006, userId: 2, recordId: 6, branchId: 2, status: "active", createdAt: new Date(now - 47 * h).toISOString(), deadline: new Date(now + 1 * h).toISOString() },
  { id: 1007, userId: 2, recordId: 8, branchId: 3, status: "active", createdAt: new Date(now - 10 * h).toISOString(), deadline: new Date(now + 38 * h).toISOString() },
];

export const INIT_LOGS: ActionLog[] = [
  { id: 1, userId: 3, action: "Добавление", object: "Пластинка", details: "Добавлена пластинка «Evening Sessions» (BN-2015-22)", createdAt: "2025-05-20T09:15:00" },
  { id: 2, userId: 4, action: "Выдача брони", object: "Бронь #1003", details: "Выдана «Ночи на Арбате» пользователю Иван Петров", createdAt: "2025-04-11T14:30:00" },
  { id: 3, userId: 3, action: "Офлайн-продажа", object: "Пластинка", details: "Продана «High Voltage» (VR-1992-01), филиал Центр", createdAt: "2025-05-21T11:45:00" },
  { id: 4, userId: 4, action: "Редактирование", object: "Пластинка", details: "Изменена цена «Патетическая симфония»: 4200 → 4500 ₽", createdAt: "2025-05-22T16:00:00" },
  { id: 5, userId: 3, action: "Снятие брони", object: "Бронь #1005", details: "Бронь переведена в статус «Просрочена»", createdAt: "2025-02-04T10:00:00" },
  { id: 6, userId: 5, action: "Добавление", object: "Менеджер", details: "Добавлен менеджер Анна Новикова (anna@sideb.ru)", createdAt: "2023-08-05T14:00:00" },
  { id: 7, userId: 3, action: "Пополнение склада", object: "Пластинка", details: "Пополнен склад «Blue Miles» на 5 ед. (филиал: Центр)", createdAt: "2025-05-23T09:30:00" },
  { id: 8, userId: 4, action: "Удаление", object: "Пластинка", details: "Удалена устаревшая позиция из каталога", createdAt: "2025-05-18T13:20:00" },
];

export const MONTHLY_SALES_DATA = [
  { month: "Янв", sales: 45, revenue: 124000 },
  { month: "Фев", sales: 52, revenue: 148000 },
  { month: "Мар", sales: 68, revenue: 195000 },
  { month: "Апр", sales: 74, revenue: 212000 },
  { month: "Май", sales: 61, revenue: 176000 },
  { month: "Июн", sales: 83, revenue: 238000 },
  { month: "Июл", sales: 71, revenue: 204000 },
  { month: "Авг", sales: 90, revenue: 258000 },
  { month: "Сен", sales: 78, revenue: 224000 },
  { month: "Окт", sales: 95, revenue: 273000 },
  { month: "Ноя", sales: 112, revenue: 322000 },
  { month: "Дек", sales: 134, revenue: 385000 },
];
