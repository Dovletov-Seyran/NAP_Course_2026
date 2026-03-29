---

# Лабораторная работа №6 — Fetch API, Promise, Vite сборка

## Цель

Замена XMLHttpRequest на современный fetch API с async/await, сборка фронтенда через Vite и раздача статики с бэкенда.

## Что реализовано

### Часть 1 — Fetch API

- Класс `Ajax` переписан с XHR на fetch + async/await
- Все методы (get, post, patch, delete) возвращают Promise
- Обработка ошибок через try/catch вместо коллбеков
- Страница тарифов: загрузка через fetch + фильтрация по названию
- Страница тарифа: загрузка по ID + редактирование через PATCH

### Часть 2 — Vite сборка + статика

- Фронтенд собирается через Vite в папку `frontend/public`
- Бэкенд раздаёт собранный фронтенд как статику
- Фронт и бэк на одном домене `http://localhost:3000` — CORS не нужен

### Дополнительно — Форма заявок

- Новый эндпоинт `POST /requests` на бэкенде
- Заявки сохраняются в `backend/src/data/requests.json`
- Форма `contact.html` отправляет данные через fetch

## Новые эндпоинты API

| Метод | URL       | Описание            |
| ----- | --------- | ------------------- |
| POST  | /requests | Создать заявку      |
| GET   | /requests | Получить все заявки |

## Структура новых файлов

```
backend/src/
├── controllers/
│   └── requestsController.js
├── services/
│   └── requestsService.js
├── routes/
│   └── requests.js
└── data/
    └── requests.json

frontend/
├── vite.config.js
└── public/             ← результат сборки
```

## Технологии

- Fetch API
- Promise / async await
- Vite 5

## Запуск

```bash
# Сборка фронтенда
cd frontend
npm run build
cp -r public ../backend/public

# Запуск сервера
cd ../backend
npm run dev
```

Открыть `http://localhost:3000`
