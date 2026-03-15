import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

export class MainPage {
  constructor(parent) {
    this.parent = parent;
  }

  getData() {
    return [
      {
        id: 1,
        src: "https://img.icons8.com/fluency/96/server.png",
        title: "Старт",
        price: "299 ₽/мес",
        text: "1 vCPU · 1 ГБ RAM · 20 ГБ SSD · 100 Мбит/с",
      },
      {
        id: 2,
        src: "https://img.icons8.com/fluency/96/cloud.png",
        title: "Базовый",
        price: "799 ₽/мес",
        text: "2 vCPU · 4 ГБ RAM · 60 ГБ SSD · 200 Мбит/с",
      },
      {
        id: 3,
        src: "https://img.icons8.com/fluency/96/lightning-bolt.png",
        title: "Бизнес",
        price: "1 999 ₽/мес",
        text: "4 vCPU · 8 ГБ RAM · 120 ГБ SSD · 500 Мбит/с",
      },
      {
        id: 4,
        src: "https://img.icons8.com/fluency/96/server-shutdown.png",
        title: "Профессионал",
        price: "3 999 ₽/мес",
        text: "8 vCPU · 16 ГБ RAM · 240 ГБ SSD · 1 Гбит/с",
      },
    ];
  }

  get pageRoot() {
    return document.getElementById("main-page");
  }

  getHTML() {
    return `
      <div class="lab-section">
        <div class="container">
          <h2 class="lab-title">Тарифы VPS/VDS</h2>
          <p class="lab-subtitle">Выберите подходящий тариф — нажмите на карточку, чтобы узнать подробнее</p>
          <div id="main-page" class="d-flex flex-wrap gap-3 justify-content-center"></div>
        </div>
      </div>
    `;
  }

  clickCard(e) {
    const cardId = e.target.dataset.id;
    if (!cardId) return;

    const toastEl = document.getElementById("lab-toast");
    const toastMsg = document.getElementById("lab-toast-msg");
    const data = this.getData().find((d) => d.id == cardId);
    if (toastMsg && data)
      toastMsg.textContent = `Тариф «${data.title}» — ${data.price}`;
    if (toastEl) new bootstrap.Toast(toastEl, { delay: 3000 }).show();

    const productPage = new ProductPage(this.parent, cardId);
    productPage.render();
  }

  render() {
    this.parent.innerHTML = "";
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());

    this.getData().forEach((item) => {
      const productCard = new ProductCardComponent(this.pageRoot);
      productCard.render(item, this.clickCard.bind(this));
    });

    // Если пришли с contact.html с ?open=id — сразу открываем тариф
    const params = new URLSearchParams(window.location.search);
    const openId = params.get("open");
    if (openId) {
      history.replaceState(null, "", window.location.pathname);
      const productPage = new ProductPage(this.parent, openId);
      productPage.render();
    }
  }
}
