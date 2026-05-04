const tariffsService = require("../services/tariffsService");

const getAllTariffs = (req, res) => {
  const { title } = req.query;
  const tariffs = tariffsService.findAll(title);
  res.json(tariffs);
};

const getTariffById = (req, res) => {
  const id = parseInt(req.params.id);
  const tariff = tariffsService.findOne(id);
  if (!tariff) {
    return res.status(404).json({ error: "Тариф не найден" });
  }
  res.json(tariff);
};

const createTariff = (req, res) => {
  const { src, title, price, text, fullText } = req.body;
  if (!title || !price || !text) {
    return res
      .status(400)
      .json({ error: "Не все обязательные поля заполнены" });
  }
  const newTariff = tariffsService.create({
    src,
    title,
    price,
    text,
    fullText,
  });
  res.status(201).json(newTariff);
};

const updateTariff = (req, res) => {
  const id = parseInt(req.params.id);
  const updated = tariffsService.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Тариф не найден" });
  }
  res.json(updated);
};

const deleteTariff = (req, res) => {
  const id = parseInt(req.params.id);
  const success = tariffsService.remove(id);
  if (!success) {
    return res.status(404).json({ error: "Тариф не найден" });
  }
  res.status(204).send();
};

module.exports = {
  getAllTariffs,
  getTariffById,
  createTariff,
  updateTariff,
  deleteTariff,
};
