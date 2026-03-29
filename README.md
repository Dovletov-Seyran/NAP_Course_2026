---

# Лабораторная работа №5 — AJAX запросы через XMLHttpRequest

## Цель

Взаимодействие с API через XMLHttpRequest, организация слоя работы с сетью.

## Вариант 3

Обновление карточки тарифа через PATCH-запрос.

## Что реализовано

- Слой `modules/` для работы с API
- Класс `Ajax` с методами get / post / patch / delete через XHR
- Класс `TariffUrls` — все эндпоинты в одном месте
- Главная страница: загрузка тарифов через XHR + фильтрация по названию
- Страница тарифа: загрузка по ID через XHR + форма редактирования с PATCH-запросом
- Карточка обновляется без перезагрузки страницы после сохранения

## Структура новых файлов

```
frontend/js/
├── modules/
│   ├── ajax.js          — XHR класс (get, post, patch, delete)
│   └── tariffUrls.js    — URL эндпоинтов API
```

## Технологии

- XMLHttpRequest (XHR)
- REST API (Express.js, из ЛР №4)

## Запуск

```bash
cd backend
npm run dev
```

Затем открыть `frontend/pages/tariffs.html` через Live Server.
