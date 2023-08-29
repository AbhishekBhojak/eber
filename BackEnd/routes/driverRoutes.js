const express = require("express");
const router = express.Router();
const multer = require("multer");
const driverController = require("../controllers/driverController");
const storage = multer.diskStorage({
  destination: "./assets/images/uploaddriver",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    // userModel.findOne({});
    // res.json({ message: "image uploaded successfully" });
    cb(null, true); // Accept the file
  } else {
    // response.status(400).json({ message: err.message });
    const err = new Error("only image files are allowed");
    err.statusCode = 400;
    cb(err); // Reject the file
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post("/storeDriver", upload.single("image"), driverController.store);
router.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ error: "only image files are allowed" });
});
router.post("/findDriver", driverController.find);
router.post("/getDriver", driverController.index);
router.put("/updateDriver", upload.single("image"), driverController.update);
router.post("/deleteDriver", driverController.Delete);
router.get("/getDriverList", driverController.driverList);
router.post("/findDriverForTrip", driverController.findDriverForTrip);
// router.post("/setTripForDriver", driverController.setTripForDriver);
module.exports = router;
