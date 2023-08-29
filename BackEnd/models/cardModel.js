const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cardData = new Schema(
  {
    userId: {
      type: String,
    },
    cardId: {
      type: String,
    },
    // cardNumber: {
    //   type: String,
    // },
    // cvv: {
    //   type: String,
    // },
    expiryMonth: {
      type: String,
    },
    expiryYear: {
      type: String,
    },
    last4: {
      type: String,
    },
  },
  { timestamps: true }
);
const cardShema = mongoose.model("cardList", cardData);
module.exports = cardShema;
