const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const createRideData = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userList",
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "VehicleType",
    },
    paymentId: {
      type: Schema.Types.ObjectId,
    },
    stopList: {
      type: Array,
    },
    pickUp: {
      type: String,
    },
    currentStatus: {
      type: String,
      default: "booked",
    },
    drop: {
      type: String,
    },
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "cardList",
      default: null,
    },
    serviceCost: {
      type: String,
    },
    distance: {
      type: String,
    },
    duration: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    Driver: {
      type: Array,
      default: [],
    },
    assignBefore: {
      type: Array,
      default: [],
    },
    assignType: {
      type: String,
      default: "selected",
    },
    paymentType: {
      type: String,
      default: "cash",
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "driverList",
      default: null,
    },
    chargeId: {
      type: String,
      default: "",
    },
    newRide: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const createRideSchema = mongoose.model("createRideList", createRideData);
module.exports = createRideSchema;
