const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

router.post("/storeCountryData", countryController.store);
router.post("/searchcountry", countryController.search);
router.post("/findcountry", countryController.findCountry);
router.get("/allCountryData", countryController.index);
module.exports = router;
