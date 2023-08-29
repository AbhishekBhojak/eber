const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const countryData = new Schema(
  {
    countryName: {
      type: String,
    },
    countryFlag: {
      type: String,
    },
    countryZone: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    currencyName: {
      type: String,
    },
    currencySymbol: {
      type: String,
    },
    countryAlt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const countrySchema = mongoose.model("countryList", countryData);
module.exports = countrySchema;
