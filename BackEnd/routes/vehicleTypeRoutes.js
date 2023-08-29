const express = require("express");
const router = express.Router();
const multer = require("multer");
const vehicleTypeController = require("../controllers/vehicleTypeController");
const storage = multer.diskStorage({
  destination: "./assets/images/uploads1",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    console.log("14-in if");
    // userModel.findOne({});
    cb(null, true); // Accept the file
  } else {
    console.log("17-in else");
    cb(false); // Reject the file
    //   router.use((err, req, res, next) => {
    //     res
    //       .status(err.statusCode || 500)
    //       .json({ message: "only image files are allowed" });
    //   });
  }
};
const upload = multer({ fileFilter: fileFilter, storage: storage });
// router.post("/countrydata", function (req, res) {
//   const country = req.body.country;

//   res.status(200).json({ message: "form data received successfully" });
// });
router.post(
  "/storeVehicleType",
  upload.single("vehicleImage"),
  vehicleTypeController.store
);
// router.use((err, req, res, next) => {
//   if (next) {
//     res.json({ message: "image uploaded successfully" });
//   } else {
//     res
//       .status(err.statusCode || 500)
//       .json({ error: "only image files are allowed" });
//   }
// });
router.get("/getVehicleType", vehicleTypeController.index);
router.post(
  "/updateVehicleType",
  upload.single("vehicleImage"),
  vehicleTypeController.update
);
module.exports = router;
