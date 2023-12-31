const express = require("express");
const router = express.Router();
const createRideController = require("../controllers/createRideController");
router.post("/store", createRideController.store);
router.post("/getCreateRide", createRideController.getCreateRideData);
// router.post("/notification", createRideController.storeNotification);
router.post("/setDriverForTrip", createRideController.setDriverForTrip);
router.post("/cancelRequest", createRideController.cancelRequest);
router.post("/acceptRequest", createRideController.acceptRequest);
router.get("/findRequestedTrip", createRideController.findRequestTrip);
router.get("/findReassignedRide", createRideController.findReassignedRide);
// router.get("/getNotification", createRideController.getNotification);
router.post("/searchInfo", createRideController.searchInfo);
router.post("/findDataByDate", createRideController.findDataByDate);
router.post("/findCancelledTrip", createRideController.findCancelledRequest);
// router.post("/downloadTrip", createRideController.download);
module.exports = router;
