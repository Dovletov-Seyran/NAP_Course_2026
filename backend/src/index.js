const express = require("express");
const cors = require("cors");
const path = require("path");
const tariffsRouter = require("./routes/tariffs");
const requestsRouter = require("./routes/requests");
const tariffsService = require("./services/tariffsService");
const requestsService = require("./services/requestsService");

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, "data/tariffs.json");
const REQUESTS_FILE_PATH = path.join(__dirname, "data/requests.json");

tariffsService.init(DATA_FILE_PATH);
requestsService.init(REQUESTS_FILE_PATH);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/tariffs", tariffsRouter);
app.use("/requests", requestsRouter);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
