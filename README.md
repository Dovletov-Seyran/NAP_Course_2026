# ЛР №6 — Fetch API, Promise, Vite сборка

> **Тема:** cloud_hosting.ru  
> [← Вернуться к оглавлению](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Цель](#цель)
- [Что реализовано](#что-реализовано)
- [Часть 1 — Fetch API](#часть-1--fetch-api)
  - [Класс Ajax на fetch](#класс-ajax-на-fetch)
  - [async/await в страницах](#asyncawait-в-страницах)
  - [Сравнение с XHR (ЛР №5)](#сравнение-с-xhr-лр-5)
- [Часть 2 — Vite сборка](#часть-2--vite-сборка)
  - [Конфигурация Vite](#конфигурация-vite)
  - [Раздача статики с бэкенда](#раздача-статики-с-бэкенда)
- [Форма заявок](#форма-заявок)
- [Структура проекта](#структура-проекта)
- [API эндпоинты](#api-эндпоинты)
- [Запуск](#запуск)

---

## Цель

Замена XMLHttpRequest на fetch + async/await. Сборка фронтенда через Vite и раздача статики с бэкенда для устранения CORS.

## Что реализовано

- Класс `Ajax` переписан с XHR на fetch + async/await
- Все методы возвращают Promise вместо коллбеков
- Обработка ошибок через try/catch
- Сборка фронтенда через Vite 5
- Бэкенд раздаёт собранный фронтенд как статику
- Фронт и бэк на одном домене — CORS не нужен
- Форма заявок: POST /requests через fetch

## Часть 1 — Fetch API

### Класс Ajax на fetch

Каждый метод теперь `async` и возвращает Promise. Вместо callback — `return response.json()`:

```js
class Ajax {
  async get(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`);
    return response.json();
  }

  async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST failed: ${response.status}`);
    return response.json();
  }

  async patch(url, data) {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`PATCH failed: ${response.status}`);
    return response.json();
  }

  async delete(url) {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`DELETE failed: ${response.status}`);
    return response.status === 204 ? null : response.json();
  }
}
```

### async/await в страницах

Код стал линейным — вместо вложенных коллбеков:

```js
// Было (ЛР №5 — XHR + callback):
getData(title) {
  ajax.get(tariffUrls.getTariffs(title), (data, status) => {
    if (status === 200) this.renderData(data);
  });
}

// Стало (ЛР №6 — fetch + async/await):
async getData(title = '') {
  try {
    const data = await ajax.get(tariffUrls.getTariffs(title));
    this.renderData(data);
  } catch (err) {
    this.pageRoot.innerHTML = '<p style="color:red">Ошибка загрузки</p>';
  }
}
```

### Сравнение с XHR (ЛР №5)

| | ЛР №5 (XHR) | ЛР №6 (fetch) |
|---|---|---|
| Синтаксис | Коллбеки | Promise / async await |
| Обработка ошибок | `if (status !== 200)` в callback | `try/catch` |
| Читаемость | Вложенность при цепочке запросов | Линейный код |
| Ответ | `xhr.responseText` → `JSON.parse()` | `response.json()` (Promise) |

## Часть 2 — Vite сборка

### Конфигурация Vite

`vite.config.js` — точка входа `pages/`, сборка в `public/`, multi-page setup:

```js
import { resolve } from 'path';

export default {
  root: './pages',
  build: {
    outDir: '../public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index:      resolve('./pages/index.html'),
        tariffs:    resolve('./pages/tariffs.html'),
        calculator: resolve('./pages/calculator.html'),
        about:      resolve('./pages/about.html'),
        contact:    resolve('./pages/contact.html'),
      },
    },
  },
};
```

Скрипты в `package.json`:

```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview"
  }
}
```

### Раздача статики с бэкенда

Собранную папку `public` копируем в бэкенд. Express раздаёт её как статику:

```js
// backend/src/index.js
app.use(express.static(path.join(__dirname, '..', 'public')));
```

Теперь фронтенд и API на одном домене `http://localhost:3000`. `baseUrl` пустой — запросы идут на тот же origin:

```js
class TariffUrls {
  constructor() {
    this.baseUrl = '';  // тот же домен
  }
  getTariffs(title) {
    return `/tariffs${title ? `?title=${encodeURIComponent(title)}` : ''}`;
  }
}
```

## Форма заявок

Новый эндпоинт `POST /requests` для формы обратной связи. Заявки сохраняются в JSON-файл:

```js
// frontend/pages/contact.html
const res = await fetch('/requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, phone, email, tariff, comment }),
});
```

## Структура проекта

```
frontend/
├── js/modules/ajax.js        ← fetch + async/await
├── js/modules/tariffUrls.js  ← URL (baseUrl пустой)
├── vite.config.js             ← конфигурация сборки
├── package.json               ← dev / build / preview
└── public/                    ← результат npm run build

backend/
├── src/index.js               ← express.static + API
├── src/routes/requests.js     ← POST /requests
├── src/data/requests.json     ← хранение заявок
└── public/                    ← копия сборки фронтенда
```

## API эндпоинты

| Метод  | URL            | Описание                        |
|--------|----------------|--------------------------------|
| GET    | /tariffs       | Список тарифов (?title=фильтр) |
| GET    | /tariffs/:id   | Тариф по ID                    |
| PATCH  | /tariffs/:id   | Обновить тариф                 |
| POST   | /requests      | Создать заявку                 |
| GET    | /requests      | Все заявки                     |

## Запуск

```bash
# 1. Сборка фронтенда
cd frontend
npm install
npm run build

# 2. Копируем в бэкенд
cp -r public ../backend/public

# 3. Запуск сервера
cd ../backend
npm install
npm run dev

# Открыть http://localhost:3000
```
