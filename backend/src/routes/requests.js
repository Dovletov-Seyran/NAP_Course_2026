const express = require("express");
const router = express.Router();
const requestsController = require("../controllers/requestsController");

router.post("/", requestsController.createRequest);
router.get("/", requestsController.getAllRequests);

module.exports = router;
