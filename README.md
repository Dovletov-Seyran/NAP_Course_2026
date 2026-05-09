# ЛР №1 — Вёрстка сайта на HTML и CSS

> **Тема:** cloud_hosting.ru  
> [← Вернуться к оглавлению](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Цель](#цель)
- [Что реализовано](#что-реализовано)
- [Структура проекта](#структура-проекта)
- [Вёрстка страниц](#вёрстка-страниц)
  - [Главная страница](#главная-страница)
  - [Страница калькулятора](#страница-калькулятора)
  - [Страница «О компании»](#страница-о-компании)
- [CSS — стилизация](#css--стилизация)
  - [CSS Custom Properties](#css-custom-properties)
  - [Шапка сайта](#шапка-сайта)
  - [Hero-секция](#hero-секция)
  - [Калькулятор — кнопки и дисплей](#калькулятор--кнопки-и-дисплей)
  - [Панель истории](#панель-истории)
  - [Подвал](#подвал)
- [Запуск](#запуск)

---

## Цель

Верстка многостраничного сайта облачного хостинга на чистом HTML и CSS без JavaScript.

## Что реализовано

- Три страницы: главная, калькулятор, о компании
- Адаптивная вёрстка с Flexbox и Grid
- CSS Custom Properties для цветовой схемы
- Интерфейс калькулятора с кнопками и дисплеем
- Панель истории вычислений
- Шапка с навигацией и подвал

## Структура проекта

```
├── project/
│   ├── index.html            // Главная страница
│   ├── calculator.html       // Калькулятор
│   ├── calculator_o.html     // Вариант калькулятора
│   └── about.html            // О компании
├── css/
│   ├── style.css             // Основные стили
│   └── style_o.css           // Альтернативные стили
└── img/
    └── main1.webp            // Изображение сервера
```

## Вёрстка страниц

### Главная страница

Hero-секция с заголовком, описанием и кнопкой CTA. Ниже — блок описания сервиса:

```html
<section class="hero">
  <div class="container">
    <div class="hero__grid">
      <div>
        <h1>Виртуальные серверы с KVM</h1>
        <p>Аренда виртуальных серверов (VPS/VDS) с гарантированными
           ресурсами с технологией виртуализации KVM</p>
        <a href="#" class="btn btn--green btn--large">Оставить заявку</a>
      </div>
      <div class="hero__image">
        <img src="/img/main1.webp" alt="Виртуальный сервер" class="hero__img" />
      </div>
    </div>
  </div>
</section>
```

### Страница калькулятора

Разметка калькулятора — дисплей с выражением и результатом, сетка кнопок (цифры, операторы, служебные):

```html
<div class="calc">
  <div class="display-area">
    <div id="expression" class="expression expression--big">0</div>
    <div id="result" class="result result--hidden">0</div>
  </div>

  <div class="buttons">
    <div class="btn-row">
      <button id="btn_op_clear" class="my-btn secondary">C</button>
      <button id="btn_op_sign" class="my-btn secondary">+/−</button>
      <button id="btn_op_percent" class="my-btn secondary">%</button>
      <button id="btn_op_div" class="my-btn operator">÷</button>
    </div>
    <div class="btn-row">
      <button id="btn_digit_7" class="my-btn" data-val="7">7</button>
      <button id="btn_digit_8" class="my-btn" data-val="8">8</button>
      <button id="btn_digit_9" class="my-btn" data-val="9">9</button>
      <button id="btn_op_mult" class="my-btn operator">×</button>
    </div>
    <!-- ... остальные ряды -->
  </div>
</div>
```

### Страница «О компании»

Стандартная информационная страница с шапкой, контентом и подвалом.

## CSS — стилизация

### CSS Custom Properties

Цветовая схема задана через переменные в `:root` — легко менять тему:

```css
:root {
  --green: #24c16d;
  --green-dark: #18a85c;
  --bg: #f5f7fb;
  --text: #111827;
  --muted: #6b7280;
  --line: #e5e7eb;
}
```

### Шапка сайта

Flexbox-раскладка с логотипом и навигацией:

```css
.header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav a {
  text-decoration: none;
  color: inherit;
}
```

### Hero-секция

Grid-раскладка для текста и изображения:

```css
.hero__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.btn--green {
  background: var(--green);
  color: #fff;
  border-radius: 8px;
  padding: 12px 32px;
}
```

### Калькулятор — кнопки и дисплей

Кнопки калькулятора с градиентным фоном, скруглёнными углами и тенью:

```css
.calc {
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(17,24,39,0.07);
}

.my-btn {
  border: none;
  border-radius: 16px;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.1s;
}

.my-btn.operator {
  background: var(--green);
  color: #fff;
}
```

### Панель истории

Боковая панель с прокруткой для истории вычислений:

```css
.history-panel {
  width: 260px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 20px;
  max-height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.history-list {
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin;
}
```

### Подвал

Grid-раскладка с колонками ссылок:

```css
.footer__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
```

## Запуск

Открыть `project/index.html` в браузере или через Live Server в VS Code.
