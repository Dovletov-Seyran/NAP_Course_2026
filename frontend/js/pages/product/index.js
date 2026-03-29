import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { tariffUrls } from "../../modules/tariffUrls.js";

export class ProductPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }

  getData() {
    ajax.get(tariffUrls.getTariffById(this.id), (data, status) => {
      if (status === 200 && data) {
        this.renderData(data);
      } else {
        this.pageRoot.innerHTML = `<p style="color:red">Тариф не найден (${status})</p>`;
      }
    });
  }

  renderData(item) {
    const product = new ProductComponent(this.pageRoot);
    product.render(item);

    // Добавляем форму редактирования после карточки
    this.pageRoot.insertAdjacentHTML("beforeend", this.getEditFormHTML(item));
    this.addEditListeners();
  }

  getEditFormHTML(item) {
    return `
      <div class="edit-form-card" id="edit-form-card">
        <h3 class="edit-form__title">Редактировать тариф</h3>
        <div class="form-group">
          <label class="form-label">Название</label>
          <input type="text" class="form-input" id="edit-title" value="${item.title}" />
        </div>
        <div class="form-group">
          <label class="form-label">Цена</label>
          <input type="text" class="form-input" id="edit-price" value="${item.price}" />
        </div>
        <div class="form-group">
          <label class="form-label">Краткое описание</label>
          <input type="text" class="form-input" id="edit-text" value="${item.text}" />
        </div>
        <div class="edit-form__actions">
          <button class="form-submit" id="edit-save-btn" style="max-width: 200px;">
            Сохранить →
          </button>
          <span id="edit-status" class="edit-status"></span>
        </div>
      </div>
    `;
  }

  addEditListeners() {
    document.getElementById("edit-save-btn").addEventListener("click", () => {
      const title = document.getElementById("edit-title").value.trim();
      const price = document.getElementById("edit-price").value.trim();
      const text = document.getElementById("edit-text").value.trim();
      const statusEl = document.getElementById("edit-status");

      if (!title || !price || !text) {
        statusEl.textContent = "Заполните все поля";
        statusEl.style.color = "red";
        return;
      }

      ajax.patch(
        tariffUrls.updateTariffById(this.id),
        { title, price, text },
        (data, status) => {
          if (status === 200 && data) {
            statusEl.textContent = "✅ Сохранено!";
            statusEl.style.color = "var(--green)";

            // Обновляем карточку на странице без перезагрузки
            this.pageRoot.innerHTML = "";
            this.renderData(data);
          } else {
            statusEl.textContent = `Ошибка сохранения (${status})`;
            statusEl.style.color = "red";
          }
        },
      );
    });
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

    this.getData();
  }
}
