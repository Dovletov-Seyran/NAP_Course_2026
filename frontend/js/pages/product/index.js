import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

const API_URL = "http://localhost:3000/tariffs";

export class ProductPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }

  async getData() {
    const res = await fetch(`${API_URL}/${this.id}`);
    if (!res.ok) throw new Error("Тариф не найден");
    return await res.json();
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

  async render() {
    this.parent.innerHTML = "";
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());

    try {
      const data = await this.getData();

      const backButton = new BackButtonComponent(this.pageRoot);
      backButton.render(this.clickBack.bind(this));

      const product = new ProductComponent(this.pageRoot);
      product.render(data);
    } catch (err) {
      this.pageRoot.innerHTML = `<p style="color:red">Не удалось загрузить тариф.</p>`;
      console.error(err);
    }
  }
}