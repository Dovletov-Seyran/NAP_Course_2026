# ЛР №3 — Компонентный подход

> **Тема:** cloud_hosting.ru  
> [← Вернуться к оглавлению](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Цель](#цель)
- [Что реализовано](#что-реализовано)
- [Структура проекта](#структура-проекта)
- [Компоненты](#компоненты)
  - [HeaderComponent](#headercomponent)
  - [ProductCardComponent](#productcardcomponent)
  - [Навигация между страницами](#навигация-между-страницами)
- [Данные тарифов](#данные-тарифов)
- [Запуск](#запуск)

---

## Цель

Рефакторинг многостраничного сайта из ЛР №1-2 на компонентный подход с использованием ES6-классов и модулей.

## Что реализовано

- Каждый UI-блок вынесен в отдельный класс-компонент
- SPA-подобная навигация: переход между списком тарифов и детальной страницей без перезагрузки
- Данные тарифов в JS-объекте (ещё нет API)
- Страницы: главная, тарифы, калькулятор, о компании, заявка

## Структура проекта

```
├── pages/
│   ├── index.html               // Главная
│   ├── tariffs.html             // Тарифы (SPA)
│   ├── calculator.html          // Калькулятор
│   ├── about.html               // О компании
│   └── contact.html             // Заявка
├── js/
│   ├── components/
│   │   ├── header/index.js      // Шапка с навигацией
│   │   ├── footer/index.js      // Подвал
│   │   ├── product-card/index.js // Карточка тарифа
│   │   ├── product/index.js     // Детальная карточка
│   │   └── back-button/index.js // Кнопка «Назад»
│   ├── pages/
│   │   ├── main/index.js        // Страница списка тарифов
│   │   └── product/index.js     // Страница конкретного тарифа
│   ├── main.js                  // Точка входа
│   └── script.js                // Калькулятор
└── css/
    └── style.css
```

## Компоненты

### HeaderComponent

Шапка сайта с навигацией. Генерирует HTML, подсвечивает текущую страницу:

```js
export class HeaderComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    const currentPage = window.location.pathname.split("/").pop();
    const navItems = [
      { label: "Главная", href: "index.html" },
      { label: "Продукты", href: "tariffs.html" },
      { label: "Калькулятор", href: "calculator.html" },
      { label: "О компании", href: "about.html" },
    ];

    const links = navItems
      .map(item => `
        <a href="${item.href}"
           class="nav__link ${currentPage === item.href ? "nav__link--active" : ""}">
          ${item.label}
        </a>`)
      .join("");

    return `
      <header class="site-header">
        <div class="container site-header__inner">
          <a href="index.html" class="site-logo">
            <span class="site-logo__icon">☁</span> cloud_hosting.ru
          </a>
          <nav class="site-nav">${links}</nav>
          <a href="contact.html" class="site-header__cta">Оставить заявку</a>
        </div>
      </header>`;
  }

  render() {
    this.parent.insertAdjacentHTML("afterbegin", this.getHTML());
  }
}
```

### ProductCardComponent

Карточка тарифа с кнопкой и обработчиком клика:

```js
export class ProductCardComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
      <div class="card lab-card" style="width: 220px;">
        <div class="card-body text-center">
          <img src="${data.src}" alt="${data.title}" class="mb-3" width="64" height="64">
          <h5 class="card-title">${data.title}</h5>
          <p class="lab-price">${data.price}</p>
          <p class="card-text text-muted small">${data.text}</p>
          <button class="btn btn-success w-100"
                  id="click-card-${data.id}"
                  data-id="${data.id}">Подробнее</button>
        </div>
      </div>`;
  }

  addListeners(data, listener) {
    document.getElementById(`click-card-${data.id}`)
      .addEventListener("click", listener);
  }

  render(data, listener) {
    this.parent.insertAdjacentHTML("beforeend", this.getHTML(data));
    this.addListeners(data, listener);
  }
}
```

### Навигация между страницами

При клике на карточку создаётся `ProductPage`, которая заменяет содержимое `#root`. Кнопка «Назад» возвращает `MainPage`:

```js
// pages/main/index.js
clickCard(e) {
  const cardId = e.target.dataset.id;
  const productPage = new ProductPage(this.parent, cardId);
  productPage.render();
}

// pages/product/index.js
clickBack() {
  new MainPage(this.parent).render();
}
```

## Данные тарифов

На этом этапе данные ещё захардкожены в JS:

```js
getData() {
  return [
    { id: 1, src: "...", title: "Старт",        price: "299 ₽/мес",   text: "1 vCPU · 1 ГБ RAM · 20 ГБ SSD" },
    { id: 2, src: "...", title: "Базовый",       price: "799 ₽/мес",   text: "2 vCPU · 4 ГБ RAM · 60 ГБ SSD" },
    { id: 3, src: "...", title: "Бизнес",        price: "1 999 ₽/мес", text: "4 vCPU · 8 ГБ RAM · 120 ГБ SSD" },
    { id: 4, src: "...", title: "Профессионал",  price: "3 999 ₽/мес", text: "8 vCPU · 16 ГБ RAM · 240 ГБ SSD" },
  ];
}
```

## Запуск

Открыть `pages/tariffs.html` через Live Server в VS Code.
