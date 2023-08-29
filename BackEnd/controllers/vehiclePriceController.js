const vehiclePriceSchema = require("../models/vehiclePriceModel");
const mongoose = require("mongoose");
const store = (req, res) => {
  // console.log(req.body);
  // res.json(req.body);
  var pipeline = [
    {
      $match: {
        cityId: new mongoose.Types.ObjectId(req.body.cityId),
        vehicleTypeId: new mongoose.Types.ObjectId(req.body.vehicleTypeId),
      },
    },
  ];
  vehiclePriceSchema
    .aggregate(pipeline)
    .then((response) => {
      if (response.length) {
        res.json({ success: false, message: "Vehicle price Already Exists" });
      } else {
        var newVehiclePrice = new vehiclePriceSchema(req.body);
        newVehiclePrice
          .save()
          .then((result) => {
            res.json({
              message: "Vehicle price data saved successfully",
              success: true,
            });
          })
          .catch((err) => {
            res.json({ message: err.message, success: false });
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.json({ message: err.message });
    });
};
const index = (req, res) => {
  vehiclePriceSchema
    .find()
    .populate({
      path: "cityId",
      select: "cityName",
    })
    .populate({
      path: "vehicleTypeId",
      select: "vehicleName vehicleImage",
    })
    .then((response) => {
      // console.log(response);
      res.json(response);
    })
    .catch((err) => {
      res.json({ message: "failed to get vehicle price data" });
    });
};
module.exports = {
  store,
  index,
};
