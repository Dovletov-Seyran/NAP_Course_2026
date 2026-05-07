class TariffUrls {
  constructor() {
    this.baseUrl = "http://localhost:3000";
  }

  getTariffs(title) {
    const query = title ? `?title=${encodeURIComponent(title)}` : "";
    return `${this.baseUrl}/tariffs${query}`;
  }

  getTariffById(id) {
    return `${this.baseUrl}/tariffs/${id}`;
  }

  createTariff() {
    return `${this.baseUrl}/tariffs`;
  }

  updateTariffById(id) {
    return `${this.baseUrl}/tariffs/${id}`;
  }

  deleteTariffById(id) {
    return `${this.baseUrl}/tariffs/${id}`;
  }
}

export const tariffUrls = new TariffUrls();
