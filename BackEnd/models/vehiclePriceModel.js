const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const vehiclePriceData = new Schema(
  {
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "countryList",
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "cityList",
    },
    vehicleTypeId: {
      type: Schema.Types.ObjectId,
      ref: "VehicleType",
    },
    driverProfit: {
      type: String,
    },
    minFare: {
      type: String,
    },
    distance: {
      type: String,
    },
    basePrice: {
      type: String,
    },
    distanceUnit: {
      type: String,
    },
    timeUnit: {
      type: String,
    },
    maxSpace: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const vehiclePriceSchema = mongoose.model("vehiclePriceList", vehiclePriceData);
module.exports = vehiclePriceSchema;
