---

# Лабораторная работа №4 — Бэкенд на Express.js

## Цель

Знакомство с Express.js, архитектурой REST API, разделением на слои (Router → Controller → Service).

## Что реализовано

- REST API для управления тарифами VPS/VDS
- Слоистая архитектура: routes / controllers / services
- Хранение данных в JSON-файле через fileService
- CORS для взаимодействия фронтенда с бэкендом
- Логирующий middleware
- Фронтенд переведён с хардкода на fetch-запросы к API

## Структура бэкенда

```
backend/
├── src/
│   ├── index.js              — точка входа, настройка сервера
│   ├── routes/
│   │   └── tariffs.js        — маршруты
│   ├── controllers/
│   │   └── tariffsController.js — обработка запросов
│   ├── services/
│   │   ├── tariffsService.js — бизнес-логика
│   │   └── fileService.js    — чтение/запись JSON
│   └── data/
│       └── tariffs.json      — хранилище данных
├── package.json
└── package-lock.json
```

## API endpoints

| Метод  | URL          | Описание             |
| ------ | ------------ | -------------------- |
| GET    | /tariffs     | Получить все тарифы  |
| GET    | /tariffs/:id | Получить тариф по ID |
| POST   | /tariffs     | Создать тариф        |
| PATCH  | /tariffs/:id | Обновить тариф       |
| DELETE | /tariffs/:id | Удалить тариф        |

## Технологии

- Node.js
- Express.js
- cors
- nodemon (dev)

## Запуск

```bash
cd backend
npm install
npm run dev
```

Сервер запускается на `http://localhost:3000`
