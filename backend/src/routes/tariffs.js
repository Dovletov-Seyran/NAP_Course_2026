const express = require("express");
const router = express.Router();
const tariffsController = require("../controllers/tariffsController");

router.get("/", tariffsController.getAllTariffs);
router.get("/:id", tariffsController.getTariffById);
router.post("/", tariffsController.createTariff);
router.patch("/:id", tariffsController.updateTariff);
router.delete("/:id", tariffsController.deleteTariff);

module.exports = router;
