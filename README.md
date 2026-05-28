
  # Музыкальный магазин

  This is a code bundle for Музыкальный магазин. The original project is available at https://www.figma.com/design/ltknqHEqZDIQCx1doSiMcP/%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  




  Бэкенд запуск
  python manage.py runserver

  Фронтенд (React + Vite) запуск
  npm run dev


==============
  unit-тесты
  
  запуск
  python manage.py test music.tests store.tests api.tests


  music/tests.py
  1. test_ensemble_creation - Создание ансамбля — правильно ли сохраняются имя, тип, год основания
  2. test_musician_creation - Создание музыканта — сохраняются ли имя, фамилия, инструменты
  3. test_participation_creation - Связь музыканта с ансамблем — правильно ли записывается роль и инструмент
  4. test_composition_creation - Создание произведения — сохраняются ли название, длительность, композитор

  store/tests.py
  1. test_record_creation - Создание пластинки — сохраняются ли каталожный номер, название, цена, остаток
  2. test_stock_decrease_on_sale - Бизнес-логика продажи — при уменьшении stock_quantity на 1 и увеличении sold_current_year на 1, правильно ли обновляются значения в базе
  3. test_reservation_creation - Создание брони — создаётся ли запись с правильным статусом и сроком истечения
  4. test_branch_creation - Создание филиала — сохраняются ли название, адрес, телефон

  api/tests.py
  PublicAPITest - тесты публичных эндпоинтов (без авторизации)
  1. test_get_ensembles - Публичный доступ к списку ансамблей — возвращает 200 OK, данные доступны всем
  2. test_get_records - Публичный доступ к списку пластинок — возвращает 200 OK, данные доступны всем
  3. test_get_top_sellers - Публичный доступ к лидерам продаж — возвращает 200 OK, эндпоинт работает без авторизации

  AuthenticatedAPITest — тесты с авторизацией
  1. test_login_returns_tokens - Вход возвращает пару JWT-токенов — в ответе есть access и refresh
  2. test_register_creates_user - Регистрация создаёт пользователя — возвращает 201 Created, пользователь появляется в базе
  3. test_user_cannot_access_admin - Обычный пользователь не может создавать ансамбли — возвращает 403 Forbidden, права ограничены