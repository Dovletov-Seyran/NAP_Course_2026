class TariffUrls {
  constructor() {
    this.baseUrl = ""; // пустой — запросы идут на тот же домен
  }

  getTariffs(title) {
    const query = title ? `?title=${encodeURIComponent(title)}` : "";
    return `/tariffs${query}`;
  }

  getTariffById(id) {
    return `/tariffs/${id}`;
  }

  createTariff() {
    return `/tariffs`;
  }

  updateTariffById(id) {
    return `/tariffs/${id}`;
  }

  deleteTariffById(id) {
    return `/tariffs/${id}`;
  }
}

export const tariffUrls = new TariffUrls();
