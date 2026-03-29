import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

const API_URL = "http://localhost:3000/tariffs";

export class MainPage {
  constructor(parent) {
    this.parent = parent;
  }

  async getData() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Ошибка загрузки тарифов");
    return await res.json();
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
    if (toastMsg) toastMsg.textContent = `Загрузка тарифа...`;
    if (toastEl) new bootstrap.Toast(toastEl, { delay: 3000 }).show();

    const productPage = new ProductPage(this.parent, cardId);
    productPage.render();
  }

  async render() {
    this.parent.innerHTML = "";
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());

    try {
      const data = await this.getData();

      data.forEach((item) => {
        const productCard = new ProductCardComponent(this.pageRoot);
        productCard.render(item, this.clickCard.bind(this));
      });

      const params = new URLSearchParams(window.location.search);
      const openId = params.get("open");
      if (openId) {
        history.replaceState(null, "", window.location.pathname);
        const productPage = new ProductPage(this.parent, openId);
        productPage.render();
      }
    } catch (err) {
      this.pageRoot.innerHTML = `<p style="color:red">Ошибка загрузки тарифов. Убедитесь что бэкенд запущен на порту 3000.</p>`;
      console.error(err);
    }
  }
}