import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class ProductPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }

  getData() {
    const items = {
      1: {
        id: 1,
        src: "https://img.icons8.com/fluency/96/server.png",
        title: "Тариф «Старт»",
        price: "299 ₽/мес",
        text: "Идеально для старта небольшого проекта или тестовой среды. Включает 1 vCPU, 1 ГБ RAM, 20 ГБ SSD и канал 100 Мбит/с.",
      },
      2: {
        id: 2,
        src: "https://img.icons8.com/fluency/96/cloud.png",
        title: "Тариф «Базовый»",
        price: "799 ₽/мес",
        text: "Отличный выбор для веб-сайтов и небольших backend-сервисов. 2 vCPU, 4 ГБ RAM, 60 ГБ SSD, 200 Мбит/с.",
      },
      3: {
        id: 3,
        src: "https://img.icons8.com/fluency/96/lightning-bolt.png",
        title: "Тариф «Бизнес»",
        price: "1 999 ₽/мес",
        text: "Для активно растущих проектов и e-commerce. 4 vCPU, 8 ГБ RAM, 120 ГБ SSD, 500 Мбит/с.",
      },
      4: {
        id: 4,
        src: "https://img.icons8.com/fluency/96/server-shutdown.png",
        title: "Тариф «Профессионал»",
        price: "3 999 ₽/мес",
        text: "Максимальная мощность для highload-проектов. 8 vCPU, 16 ГБ RAM, 240 ГБ SSD, 1 Гбит/с.",
      },
    };
    return items[this.id] || items[1];
  }

  get pageRoot() {
    return document.getElementById("product-page");
  }

  getHTML() {
    return `<div class="lab-section"><div class="container"><div id="product-page"></div></div></div>`;
  }

  clickBack() {
    const mainPage = new MainPage(this.parent);
    mainPage.render();
  }

  render() {
    this.parent.innerHTML = "";
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());

    const backButton = new BackButtonComponent(this.pageRoot);
    backButton.render(this.clickBack.bind(this));

    const product = new ProductComponent(this.pageRoot);
    product.render(this.getData());
  }
}
