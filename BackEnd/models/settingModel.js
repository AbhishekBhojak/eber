const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const settingData = new Schema(
  {
    serverStartTime: {
      type: Date,
    },
    time: {
      type: String,
    },
    stops: {
      type: String,
    },
    fromMail: {
      type: String,
    },
    twilioNumber: {
      type: String,
    },
    stripeKey: {
      type: String,
    },
  },
  { timestamps: true }
);
const setttingSchema = mongoose.model("settingList", settingData);
module.exports = setttingSchema;
