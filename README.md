# ЛР №5 — AJAX-запросы через XMLHttpRequest

> **Тема:** cloud_hosting.ru  
> [← Вернуться к оглавлению](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Цель](#цель)
- [Что реализовано](#что-реализовано)
- [Структура модулей](#структура-модулей)
- [Класс Ajax — XMLHttpRequest](#класс-ajax--xmlhttprequest)
  - [GET-запрос](#get-запрос)
  - [PATCH-запрос](#patch-запрос)
  - [Обработка ответа](#обработка-ответа)
- [Класс TariffUrls — эндпоинты](#класс-tariffurls--эндпоинты)
- [Главная страница — загрузка и фильтрация](#главная-страница--загрузка-и-фильтрация)
- [Страница тарифа — PATCH редактирование](#страница-тарифа--patch-редактирование)
- [CORS](#cors)
- [API эндпоинты](#api-эндпоинты)
- [Запуск](#запуск)

---

## Цель

Подключить фронтенд к бэкенду (ЛР №4) через XMLHttpRequest. Карточки тарифов приходят с сервера по API, а не захардкожены в коде.

## Что реализовано

- Класс `Ajax` с методами get, post, patch, delete на основе XMLHttpRequest
- Класс `TariffUrls` для централизованного хранения URL-адресов API
- Главная страница: загрузка списка тарифов через GET + фильтрация по названию
- Страница тарифа: загрузка по ID через GET + редактирование через PATCH
- Вариант 3: обновление карточки через PATCH-запрос

## Структура модулей

```
frontend/js/
├── modules/
│   ├── ajax.js           ← класс Ajax (XMLHttpRequest + callbacks)
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

## Класс Ajax — XMLHttpRequest

### GET-запрос

Создаём `XMLHttpRequest`, открываем соединение, отправляем. Ответ ловим через `onreadystatechange` — вызывается при каждой смене состояния. `readyState === 4` означает «запрос завершён»:

```js
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
```

### PATCH-запрос

Для отправки JSON ставим заголовок `Content-Type` и сериализуем данные:

```js
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
```

### Обработка ответа

Парсим JSON из `responseText`, вызываем callback с данными и HTTP-статусом:

```js
_handleResponse(xhr, callback) {
  try {
    const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
    callback(data, xhr.status);
  } catch (e) {
    console.error('Ошибка парсинга JSON:', e);
    callback(null, xhr.status);
  }
}
```

## Класс TariffUrls — эндпоинты

Все URL в одном месте. Если сервер переедет на другой адрес — меняем только `baseUrl`:

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

## Главная страница — загрузка и фильтрация

При загрузке вызывается `getData()`, который делает GET-запрос. В callback рисуются карточки. Поле фильтра при вводе вызывает `getData(value)` — запрос летит с `?title=...`:

```js
getData(title = '') {
  ajax.get(tariffUrls.getTariffs(title), (data, status) => {
    if (status === 200 && data) {
      this.renderData(data);
    } else {
      this.pageRoot.innerHTML = '<p style="color:red">Ошибка загрузки</p>';
    }
  });
}

// Фильтрация при вводе
document.getElementById('filter-input').addEventListener('input', (e) => {
  this.getData(e.target.value);
});
```

## Страница тарифа — PATCH редактирование

Форма с тремя полями. При клике на «Сохранить» отправляется PATCH-запрос с обновлёнными данными:

```js
ajax.patch(
  tariffUrls.updateTariffById(this.id),
  { title, price, text },
  (data, status) => {
    if (status === 200 && data) {
      statusEl.textContent = 'Сохранено!';
      this.renderData(data);   // перерисовываем карточку
    } else {
      statusEl.textContent = 'Ошибка сохранения';
    }
  }
);
```

## CORS

Фронтенд на Live Server (порт 5500), бэкенд на Express (порт 3000) — разные домены. Браузер блокирует кроссдоменные запросы. Решение: на сервере подключён `app.use(cors())`, который добавляет заголовок `Access-Control-Allow-Origin: *`.

## API эндпоинты

| Метод  | URL            | Описание                        |
|--------|----------------|--------------------------------|
| GET    | /tariffs       | Список тарифов (?title=фильтр) |
| GET    | /tariffs/:id   | Тариф по ID                    |
| POST   | /tariffs       | Создать тариф                  |
| PATCH  | /tariffs/:id   | Обновить тариф                 |
| DELETE | /tariffs/:id   | Удалить тариф                  |

## Запуск

```bash
# 1. Бэкенд
cd backend && npm install && npm run dev
# Сервер на http://localhost:3000

# 2. Фронтенд — через Live Server в VS Code
# Открыть frontend/pages/tariffs.html
```
