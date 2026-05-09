# Программирование сетевых приложений — Курс 2026

> **Тема:** cloud_hosting.ru — сервис облачного хостинга VPS/VDS
> **Студент:** Довлетов Сейран
> **Репозиторий:** [GitHub](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Лабораторные работы](#лабораторные-работы)
  - [ЛР №1 — Вёрстка сайта (HTML + CSS)](#лр-1--вёрстка-сайта-html--css)
  - [ЛР №1-2 — Вёрстка + Калькулятор (JavaScript)](#лр-12--вёрстка--калькулятор-javascript)
  - [ЛР №3 — Компонентный подход](#лр-3--компонентный-подход)
  - [ЛР №4 — REST API (Express.js)](#лр-4--rest-api-expressjs)
  - [ЛР №5 — AJAX (XMLHttpRequest)](#лр-5--ajax-xmlhttprequest)
  - [ЛР №6 — Fetch API + Vite](#лр-6--fetch-api--vite)
- [Домашние задания](#домашние-задания)
  - [ДЗ №1 — Анаграммы](#дз-1--анаграммы)
  - [ДЗ №2 — 3D Gallery (Three.js)](#дз-2--3d-gallery-threejs)
- [Технологии](#технологии)
- [Запуск проекта](#запуск-проекта)

---

## Лабораторные работы

### ЛР №1 — Вёрстка сайта (HTML + CSS)

**Ветка:** [`html-css-calculator`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/html-css-calculator)

Вёрстка многостраничного сайта cloud_hosting.ru на чистом HTML и CSS. Три страницы: главная с hero-секцией, калькулятор с интерфейсом кнопок и панелью истории, страница «О компании». CSS Custom Properties, Flexbox, Grid.

---

### ЛР №1-2 — Вёрстка + Калькулятор (JavaScript)

**Ветка:** [`javascript-calculator`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/javascript-calculator)

Многостраничный сайт cloud_hosting.ru (главная, калькулятор, о компании) и JavaScript-калькулятор с историей операций, приоритетом операторов и обработкой клавиатуры.

---

### ЛР №3 — Компонентный подход

**Ветка:** [`lab3`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/lab3)

Рефакторинг сайта на компоненты (Header, Footer, ProductCard, BackButton). SPA-подобная навигация между страницами через JavaScript-классы. Данные тарифов хранятся в коде.

---

### ЛР №4 — REST API (Express.js)

**Ветка:** [`lab4`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/lab4)

Бэкенд на Express.js с REST API для тарифов. Трёхслойная архитектура: routes → controllers → services. Данные в JSON-файле. CRUD-операции: GET, POST, PATCH, DELETE.

---

### ЛР №5 — AJAX (XMLHttpRequest)

**Ветка:** [`lab5`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/lab5)

Фронтенд подключён к API через XMLHttpRequest с коллбеками. Фильтрация тарифов по названию, редактирование через PATCH-запрос. CORS через расширение или middleware.

---

### ЛР №6 — Fetch API + Vite

**Ветка:** [`lab6`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/lab6)

Замена XHR на fetch + async/await. Сборка фронтенда через Vite, раздача статики с бэкенда. Фронт и бэк на одном домене — CORS не нужен.

---

## Домашние задания

### ДЗ №1 — Анаграммы

**Ветка:** [`hw-1`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/hw-1)

Функция группировки анаграмм: сортировка букв каждого слова как ключ, группировка по ключу, фильтрация одиночных слов.

---

### ДЗ №2 — 3D Gallery (Three.js)

**Ветка:** [`hw-2`](https://github.com/Dovletov-Seyran/NAP_Course_2026/tree/hw-2)

Интерактивная 3D-галерея оборудования на Three.js. Загрузка GLB-моделей, OrbitControls для вращения камеры, IndexedDB для пользовательских моделей. Интеграция в существующий сайт.

---

## Запуск проекта

```bash
git clone https://github.com/Dovletov-Seyran/NAP_Course_2026.git
cd NAP_Course_2026

# Переключиться на нужную ветку
git checkout lab6    # или lab5, hw-2 и т.д.
```

Подробные инструкции по запуску — в README каждой ветки.
