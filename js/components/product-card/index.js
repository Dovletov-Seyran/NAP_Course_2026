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
          <button
            class="btn btn-success w-100"
            id="click-card-${data.id}"
            data-id="${data.id}"
          >Смотреть в 3D</button>
        </div>
      </div>
    `;
  }

  addListeners(data, listener) {
    document
      .getElementById(`click-card-${data.id}`)
      .addEventListener("click", listener);
  }

  render(data, listener) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML("beforeend", html);
    this.addListeners(data, listener);
  }
}
