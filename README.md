# ЛР №4 — REST API на Express.js

> **Тема:** cloud_hosting.ru  
> [← Вернуться к оглавлению](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Цель](#цель)
- [Что реализовано](#что-реализовано)
- [Структура проекта](#структура-проекта)
- [Архитектура бэкенда](#архитектура-бэкенда)
  - [Точка входа (index.js)](#точка-входа-indexjs)
  - [Маршруты (routes)](#маршруты-routes)
  - [Контроллеры (controllers)](#контроллеры-controllers)
  - [Сервисы (services)](#сервисы-services)
  - [Файловый сервис](#файловый-сервис)
- [API эндпоинты](#api-эндпоинты)
- [Данные](#данные)
- [Запуск](#запуск)

---

## Цель

Создание серверной части приложения на Node.js + Express.js с REST API для управления тарифами VPS/VDS.

## Что реализовано

- Express.js сервер на порту 3000
- REST API с полным CRUD для тарифов
- Трёхслойная архитектура: routes → controllers → services
- Хранение данных в JSON-файле
- CORS middleware для кроссдоменных запросов
- Логирование запросов

## Структура проекта

```
backend/
├── src/
│   ├── index.js                    // Точка входа, запуск сервера
│   ├── routes/
│   │   └── tariffs.js              // Маршруты /tariffs
│   ├── controllers/
│   │   └── tariffsController.js    // Обработка запросов/ответов
│   ├── services/
│   │   ├── tariffsService.js       // Бизнес-логика (CRUD)
│   │   └── fileService.js          // Чтение/запись JSON
│   └── data/
│       └── tariffs.json            // Данные тарифов
└── package.json
```

## Архитектура бэкенда

### Точка входа (index.js)

Создание Express-приложения, подключение middleware и маршрутов:

```js
const express = require('express');
const cors = require('cors');
const path = require('path');
const tariffsRouter = require('./routes/tariffs');
const tariffsService = require('./services/tariffsService');

const app = express();
const PORT = 3000;

tariffsService.init(path.join(__dirname, 'data/tariffs.json'));

app.use(cors());
app.use(express.json());

// Логирование каждого запроса
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/tariffs', tariffsRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
```

### Маршруты (routes)

Привязка HTTP-методов к функциям контроллера:

```js
const express = require('express');
const router = express.Router();
const tariffsController = require('../controllers/tariffsController');

router.get('/',    tariffsController.getAllTariffs);
router.get('/:id', tariffsController.getTariffById);
router.post('/',   tariffsController.createTariff);
router.patch('/:id', tariffsController.updateTariff);
router.delete('/:id', tariffsController.deleteTariff);

module.exports = router;
```

### Контроллеры (controllers)

Обработка HTTP-запросов — валидация параметров, вызов сервиса, формирование ответа:

```js
const getAllTariffs = (req, res) => {
  const { title } = req.query;           // ?title=Старт
  const tariffs = tariffsService.findAll(title);
  res.json(tariffs);
};

const getTariffById = (req, res) => {
  const id = parseInt(req.params.id);
  const tariff = tariffsService.findOne(id);
  if (!tariff) return res.status(404).json({ error: 'Тариф не найден' });
  res.json(tariff);
};

const createTariff = (req, res) => {
  const { src, title, price, text, fullText } = req.body;
  if (!title || !price || !text)
    return res.status(400).json({ error: 'Не все поля заполнены' });
  const newTariff = tariffsService.create({ src, title, price, text, fullText });
  res.status(201).json(newTariff);
};

const updateTariff = (req, res) => {
  const id = parseInt(req.params.id);
  const updated = tariffsService.update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Тариф не найден' });
  res.json(updated);
};

const deleteTariff = (req, res) => {
  const id = parseInt(req.params.id);
  const success = tariffsService.remove(id);
  if (!success) return res.status(404).json({ error: 'Тариф не найден' });
  res.status(204).send();
};
```

### Сервисы (services)

Бизнес-логика — работа с массивом данных, фильтрация, CRUD:

```js
const findAll = (title) => {
  const tariffs = fileService.readData(dataFilePath);
  if (title) {
    return tariffs.filter(t =>
      t.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  return tariffs;
};

const update = (id, data) => {
  const tariffs = fileService.readData(dataFilePath);
  const index = tariffs.findIndex(t => t.id === id);
  if (index === -1) return null;
  tariffs[index] = { ...tariffs[index], ...data };
  fileService.writeData(dataFilePath, tariffs);
  return tariffs[index];
};
```

### Файловый сервис

Обёртка над `fs` для чтения и записи JSON:

```js
const fs = require('fs');

const readData = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
```

## API эндпоинты

| Метод  | URL           | Описание                        |
|--------|---------------|--------------------------------|
| GET    | /tariffs      | Список тарифов (?title=фильтр) |
| GET    | /tariffs/:id  | Тариф по ID                    |
| POST   | /tariffs      | Создать тариф                  |
| PATCH  | /tariffs/:id  | Обновить тариф                 |
| DELETE | /tariffs/:id  | Удалить тариф                  |

## Данные

```json
[
  { "id": 1, "title": "Старт",        "price": "500 ₽/мес",   "text": "1 vCPU · 1 ГБ RAM · 20 ГБ SSD" },
  { "id": 2, "title": "Базовый",      "price": "1085 ₽/мес",  "text": "2 vCPU · 4 ГБ RAM · 60 ГБ SSD" },
  { "id": 3, "title": "Бизнес",       "price": "1060 ₽/мес",  "text": "4 vCPU · 8 ГБ RAM · 120 ГБ SSD" },
  { "id": 4, "title": "Профессионал", "price": "3 999 ₽/мес", "text": "8 vCPU · 16 ГБ RAM · 240 ГБ SSD" }
]
```

## Запуск

```bash
cd backend
npm install
npm run dev
# Сервер на http://localhost:3000
```

Проверка: `curl http://localhost:3000/tariffs`
