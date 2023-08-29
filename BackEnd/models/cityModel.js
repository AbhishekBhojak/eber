const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cityData = new Schema(
  {
    countryId: {
      type: Schema.Types.ObjectId,
    },
    cityName: {
      type: String,
    },
    areaCoords: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
const citySchema = mongoose.model("cityList", cityData);
module.exports = citySchema;
