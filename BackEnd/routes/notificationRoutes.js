const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
router.post("/storeNotifications", notificationController.storeNotifications);
router.get("/getNotifications", notificationController.getNotifications);
module.exports = router;
