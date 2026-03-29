const requestsService = require("../services/requestsService");

const createRequest = (req, res) => {
  const { name, phone, email, tariff, comment } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: "Заполните обязательные поля" });
  }

  const newRequest = requestsService.create({
    name,
    phone,
    email,
    tariff,
    comment,
  });
  res.status(201).json(newRequest);
};

const getAllRequests = (req, res) => {
  const requests = requestsService.findAll();
  res.json(requests);
};

module.exports = { createRequest, getAllRequests };
