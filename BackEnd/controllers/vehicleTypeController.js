const vehicleSchema = require("../models/vehicleTypeModel");
var Socket;
const { io } = require("../socket");
io.on("connection", (socket) => {
  Socket = socket;
});
const index = (req, res, next) => {
  vehicleSchema
    .find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json({
        message: "an error occurred while getting data",
      });
    });
};
const store = (req, res, next) => {
  console.log("16->", req.body);
  console.log("17->", req.file);
  if (!req.file) {
    res.json({ message: "an error occurred while performing" });
    return;
  }
  var newVehicleData = new vehicleSchema({
    vehicleName: req.body.name,
    vehicleImage: req.file.filename,
  });
  newVehicleData
    .save()
    .then((response) => {
      // console.log(response);
      res.json({
        message: "data inserted successfully",
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.json({
        message: "fail to save data",
      });
    });
};

const update = (req, res) => {
  var data = {};
  if (req.file) {
    data.vehicleImage = req.file.filename;
  }
  if (req.body.vehicleName) {
    data.vehicleName = req.body.vehicleName;
  }
  var id = req.body._id;
  vehicleSchema
    .findByIdAndUpdate({ _id: id }, data)
    .then((response) => {
      Socket.emit("update", { msg: "called" });
      res.json({ message: "data updated successfully" });
    })
    .catch((err) => {
      res.json({ message: "error in updating vehicle" });
    });
};
module.exports = {
  index,
  store,
  update,
};
