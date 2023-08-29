const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

router.post("/store", cityController.store);
router.get("/get", cityController.getCities);
router.put("/update", cityController.updateCity);
module.exports = router;
