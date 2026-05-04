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
        src: "https://img.icons8.com/fluency/96/router.png",
        title: "Маршрутизатор",
        price: "12 490 ₽",
        text: "Высокопроизводительный маршрутизатор для построения корпоративной сети. Поддержка VLAN, QoS, VPN.",
        model: "../models/router.glb",
      },
      {
        id: 2,
        src: "https://img.icons8.com/fluency/96/server.png",
        title: "Сервер",
        price: "89 900 ₽",
        text: "Стоечный сервер 1U для дата-центров. Intel Xeon, 64 ГБ ECC RAM, 2x SSD NVMe, резервный БП.",
        model: "../models/server.glb",
      },
      {
        id: 3,
        src: "https://img.icons8.com/fluency/96/laptop.png",
        title: "Ноутбук администратора",
        price: "74 990 ₽",
        text: "Рабочая станция для системного администратора. 16 ГБ RAM, SSD 512 ГБ, IPS-дисплей 15.6\".",
        model: "../models/laptop.glb",
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
          <h2 class="lab-title">Каталог оборудования</h2>
          <p class="lab-subtitle">Выберите оборудование — нажмите на карточку, чтобы посмотреть 3D-модель и подробности</p>
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
      toastMsg.textContent = `Выбрано: ${data.title}`;
    if (toastEl) new bootstrap.Toast(toastEl, { delay: 3000 }).show();

    const productPage = new ProductPage(this.parent, cardId, this.getData());
    productPage.render();
  }

  render() {
    this.parent.innerHTML = "";
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());

    this.getData().forEach((item) => {
      const productCard = new ProductCardComponent(this.pageRoot);
      productCard.render(item, this.clickCard.bind(this));
    });

    const params = new URLSearchParams(window.location.search);
    const openId = params.get("open");
    if (openId) {
      history.replaceState(null, "", window.location.pathname);
      const productPage = new ProductPage(this.parent, openId, this.getData());
      productPage.render();
    }
  }
}
