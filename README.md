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

## Ключевые фрагменты кода

### Fetch API — класс Ajax (`modules/ajax.js`)

```js
class Ajax {
  async get(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`);
    return response.json();
  }

  async patch(url, data) {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`PATCH ${url} failed: ${response.status}`);
    return response.json();
  }
}
```

### Загрузка карточек через async/await (`pages/main/index.js`)

```js
async getData(title = "") {
  try {
    const data = await ajax.get(tariffUrls.getTariffs(title));
    this.renderData(data);
  } catch (err) {
    this.pageRoot.innerHTML = `<p style="color:red">Ошибка загрузки</p>`;
    console.error(err);
  }
}
```

### Редактирование тарифа через PATCH (`pages/product/index.js`)

```js
const data = await ajax.patch(tariffUrls.updateTariffById(this.id), {
  title, price, text,
});
statusEl.textContent = "Сохранено!";
this.renderData(data);
```

### Конфигурация Vite (`vite.config.js`)

```js
export default {
  root: "./pages",
  build: {
    outDir: "../public",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve("./pages/index.html"),
        tariffs: resolve("./pages/tariffs.html"),
        calculator: resolve("./pages/calculator.html"),
        about: resolve("./pages/about.html"),
        contact: resolve("./pages/contact.html"),
      },
    },
  },
};
```

### Раздача статики на бэкенде (`backend/src/index.js`)

```js
app.use(express.static(path.join(__dirname, "..", "public")));
```

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
├── package.json          ← скрипты dev/build/preview
└── public/               ← результат сборки
```

## Технологии

- Fetch API
- Promise / async await
- Vite 5

## Запуск

```bash
# Сборка фронтенда
cd frontend
npm install
npm run build

# Копируем сборку в бэкенд
cp -r public ../backend/public

# Запуск сервера
cd ../backend
npm install
npm run dev
```

Открыть `http://localhost:3000`
