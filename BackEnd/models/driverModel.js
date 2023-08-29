const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const driverData = new Schema(
  {
    driverProfile: {
      type: String,
    },
    driverName: {
      type: String,
    },
    driverEmail: {
      type: String,
      unique: true,
    },
    driverPhone: {
      type: String,
    },
    driverStatus: {
      type: Boolean,
      default: true,
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "countryList",
    },
    currentRide: {
      type: String,
      default: "",
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "cityList",
    },
    vehicleTypeId: {
      type: Schema.Types.ObjectId,
      ref: "VehicleType",
    },
  },
  {
    timestamps: true,
  }
);
const driverSchema = mongoose.model("driverList", driverData);
module.exports = driverSchema;
