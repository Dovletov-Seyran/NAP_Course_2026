import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ajax } from "../../modules/ajax.js";
import { tariffUrls } from "../../modules/tariffUrls.js";

export class MainPage {
  constructor(parent) {
    this.parent = parent;
  }

  getData(title = "") {
    ajax.get(tariffUrls.getTariffs(title), (data, status) => {
      if (status === 200 && data) {
        this.renderData(data);
      } else {
        this.pageRoot.innerHTML = `<p style="color:red">Ошибка загрузки тарифов (${status})</p>`;
      }
    });
  }

  renderData(items) {
    // Очищаем список перед отрисовкой (нужно для фильтрации)
    this.pageRoot.innerHTML = "";
    items.forEach((item) => {
      const productCard = new ProductCardComponent(this.pageRoot);
      productCard.render(item, this.clickCard.bind(this));
    });
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

          <div class="filter-row">
            <input
              type="text"
              id="filter-input"
              class="form-input"
              placeholder="Поиск по названию тарифа..."
              style="max-width: 360px; margin-bottom: 28px;"
            />
          </div>

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

  render() {
    this.parent.innerHTML = "";
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());

    // Загружаем все тарифы
    this.getData();

    // Фильтрация при вводе текста
    document.getElementById("filter-input").addEventListener("input", (e) => {
      this.getData(e.target.value);
    });

    // Обработка ?open=id из URL (возврат с contact.html)
    const params = new URLSearchParams(window.location.search);
    const openId = params.get("open");
    if (openId) {
      history.replaceState(null, "", window.location.pathname);
      const productPage = new ProductPage(this.parent, openId);
      productPage.render();
    }
  }
}
