const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userData = new Schema(
  {
    userImage: {
      type: String,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
      unique: true,
    },
    userPhone: {
      type: String,
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "countryList",
    },
    type: {
      type: String,
    },
    password: {
      type: String,
    },
    userStripeId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const userSchema = mongoose.model("userList", userData);
module.exports = userSchema;
