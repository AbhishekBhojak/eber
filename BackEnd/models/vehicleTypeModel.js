const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const vehicleData = Schema(
  {
    vehicleName: {
      type: "String",
    },
    vehicleImage: {
      type: "String",
    },
  },
  {
    timestamps: true,
  }
);
const vehicleSchema = mongoose.model("VehicleType", vehicleData);
module.exports = vehicleSchema;
