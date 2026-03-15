export class ProductComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
      <div class="card lab-product-card mt-3">
        <div class="row g-0">
          <div class="col-md-3 d-flex align-items-center justify-content-center p-4">
            <img src="${data.src}" alt="${data.title}" width="96" height="96">
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h4 class="card-title">${data.title}</h4>
              <p class="lab-price fs-4">${data.price}</p>
              <p class="card-text">${data.text}</p>
              <a href="contact.html?from=${data.id}" class="btn btn-success mt-2">Оставить заявку</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render(data) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML("beforeend", html);
  }
}
