const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
router.post("/storeCard", cardController.store);
router.get("/getCard", cardController.getCards);
module.exports = router;
