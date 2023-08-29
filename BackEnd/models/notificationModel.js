const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationData = new Schema(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      ref: "createRideList",
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "driverList",
      default: null,
    },
    userId: {
      type: String,
      ref: "userlist",
      default: null,
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const notificationSchema = mongoose.model("notificationList", notificationData);
module.exports = notificationSchema;
