const express = require("express");
const router = express.Router();
const multer = require("multer");
const settingController = require("../controllers/settingController");

const upload = multer();
router.post("/updateSetting", upload.none(), settingController.update);
router.get("/getSetting", settingController.index);
module.exports = router;
