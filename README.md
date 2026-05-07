---

# Лабораторная работа №5 — AJAX-запросы к API (XMLHttpRequest)

## Цель

Взаимодействие с внешним API через XMLHttpRequest. Получение данных тарифов VPS/VDS с бэкенда и вывод их в интерфейс, фильтрация по названию, редактирование через PATCH-запрос.

## Что реализовано

### Базовая часть

- Класс `Ajax` с методами `get`, `post`, `patch`, `delete` на основе XMLHttpRequest
- Класс `TariffUrls` для централизованного хранения эндпоинтов API
- Главная страница тарифов: загрузка списка карточек через GET-запрос
- Страница тарифа: загрузка по ID через GET-запрос

### Дополнительные задания (вариант 3)

- Фильтрация карточек по названию через query-параметр `?title=...`
- Редактирование тарифа на странице карточки через PATCH-запрос
- Форма с полями: название, цена, описание

## Структура модулей

```
frontend/js/
├── modules/
│   ├── ajax.js           ← класс Ajax (XMLHttpRequest)
│   └── tariffUrls.js     ← эндпоинты API тарифов
├── pages/
│   ├── main/index.js     ← главная с карточками + фильтр
│   └── product/index.js  ← страница тарифа + PATCH-форма
└── components/
    ├── product-card/     ← компонент карточки
    ├── product/          ← компонент детальной карточки
    ├── header/           ← шапка
    ├── footer/           ← подвал
    └── back-button/      ← кнопка «Назад»
```

## Ключевые фрагменты кода

### XMLHttpRequest — класс Ajax (`modules/ajax.js`)

```js
class Ajax {
  get(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this._handleResponse(xhr, callback);
      }
    };
  }

  patch(url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this._handleResponse(xhr, callback);
      }
    };
  }

  _handleResponse(xhr, callback) {
    try {
      const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      callback(data, xhr.status);
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e);
      callback(null, xhr.status);
    }
  }
}
```

### Эндпоинты API (`modules/tariffUrls.js`)

```js
class TariffUrls {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
  }
  getTariffs(title) {
    const query = title ? `?title=${encodeURIComponent(title)}` : '';
    return `${this.baseUrl}/tariffs${query}`;
  }
  getTariffById(id) {
    return `${this.baseUrl}/tariffs/${id}`;
  }
  updateTariffById(id) {
    return `${this.baseUrl}/tariffs/${id}`;
  }
}
```

### Загрузка карточек с фильтрацией (`pages/main/index.js`)

```js
getData(title = '') {
  ajax.get(tariffUrls.getTariffs(title), (data, status) => {
    if (status === 200 && data) {
      this.renderData(data);
    }
  });
}
```

### Редактирование через PATCH (`pages/product/index.js`)

```js
ajax.patch(
  tariffUrls.updateTariffById(this.id),
  { title, price, text },
  (data, status) => {
    if (status === 200 && data) {
      statusEl.textContent = 'Сохранено!';
      this.renderData(data);
    }
  }
);
```

## API эндпоинты

| Метод  | URL            | Описание                        |
| ------ | -------------- | ------------------------------- |
| GET    | /tariffs       | Список тарифов (?title=фильтр) |
| GET    | /tariffs/:id   | Тариф по ID                    |
| POST   | /tariffs       | Создать тариф                   |
| PATCH  | /tariffs/:id   | Обновить тариф                  |
| DELETE | /tariffs/:id   | Удалить тариф                   |

## Технологии

- XMLHttpRequest
- Callback-функции
- Express.js (бэкенд)
- CORS

## Запуск

```bash
# 1. Запуск бэкенда
cd backend
npm install
npm run dev
# Сервер на http://localhost:3000

# 2. Открыть фронтенд
# Открыть frontend/pages/tariffs.html через Live Server (VS Code)
# Либо: npx http-server frontend -p 5500
```

При CORS-ошибках — на сервере уже подключён `cors()`, либо использовать расширение CORS Unblock.
