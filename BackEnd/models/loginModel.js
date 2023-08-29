const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const loginData = new Schema(
  {
    adminName: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);
const loginSchema = mongoose.model("adminList", loginData);
module.exports = loginSchema;
