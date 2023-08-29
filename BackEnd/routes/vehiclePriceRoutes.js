const express = require("express");
const router = express.Router();
const vehiclePriceController = require("../controllers/vehiclePriceController");
router.post("/storeVehiclePrice", vehiclePriceController.store);
router.get("/getVehiclePrice", vehiclePriceController.index);
module.exports = router;
