const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/userController");
const storage = multer.diskStorage({
  destination: "./assets/images/uploaduser",
  filename: (req, file, cb) => {
    // if (file.mimetype.split("/")[0] == "image") {
    cb(null, Date.now() + file.originalname);
    console.log("saved");
    // } else {
    //   cb(null, false);
    // }
  },
});
const fileFilter = (req, file, cb) => {
  console.log("17", file);
  if (file.mimetype.startsWith("image/")) {
    // userModel.findOne({});
    // res.json({ message: "image uploaded successfully" });
    cb(null, true); // Accept the file
  } else {
    cb(false);
    router.use((err, req, res, next) => {
      res
        .status(err.statusCode || 500)
        .json({ message: "only image files are allowed" });
    });
    // response.status(400).json({ message: err.message });
    // const err = new Error("only image files are allowed");
    // err.statusCode = 400;
    // cb(err); // Reject the file
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post("/storeUser", upload.single("image"), userController.store);
router.post("/getUser", userController.index);
// router.use((err, req, res, next) => {
//   res
//     .status(err.statusCode || 500)
//     .json({ message: "only image files are allowed" });
// });
router.put("/updateUser", upload.single("image"), userController.update);
router.post("/deleteUser", userController.Delete);
router.get("/getUserNumber/:userPhone", userController.userNumber);
module.exports = router;
