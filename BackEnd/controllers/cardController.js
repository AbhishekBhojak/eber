require("dotenv").config();
const cardShema = require("../models/cardModel");
const userModel = require("../models/userModel");
const createRideModel = require("../models/createRideModel");
const seckret_key = process.env.seckretKey;
const stripe = require("stripe")(seckret_key);
function createCard(data, customerId, res) {
  var cardNumber = data.number;
  var cvv = data.cvc;
  stripe.tokens
    .create({
      card: data,
    })
    .then((token) => {
      stripe.customers.createSource(
        customerId,
        { source: token.id },
        (err, card) => {
          if (err) {
            console.log(err.message);
          } else {
            var data = {
              userId: card.customer,
              cardId: card.id,
              // cardNumber: cardNumber,
              // cvv: cvv,
              expiryMonth: card.exp_month,
              expiryYear: card.exp_year,
              last4: card.last4,
            };
            var newCardSchema = new cardShema(data);
            newCardSchema
              .save()
              .then((response) => {
                // console.log(response);
                res.json({ message: "card saves successfully", success: true });
                // res.json({ message: "card stored successfully", sucess: true });
              })
              .catch((err) => {
                console.log(err.message);
                res.json({ message: err.message, success: false });
              });
          }
        }
      );
    })
    .catch((error) => {
      console.log("20 in error");
      res.json({ message: error.message, success: false });
    });
  //
  // return token
}
// const generatePayment = async (req, res) => {
//   var cardId;
//   var cardData;
//   if (req.body.cardId) {
//     cardId = req.body.cardId;
//     cardData = await cardShema.find({ _id: cardId });
//     console.log("cc-59", cardData);
//   }
//   // createRideModel
//   //   .find({ paymentType: "card", currentStatus: "completed" ,cardId:cardId})
//   //   .then((response) => {
//   //     console.log("cardET", response);
//   //     stripe.charges.create({
//   //       amount: response.serviceCost,
//   //       customer:cardData[0].cardId,
//   //       currency:'inr',
//   //       source:cardData[0].userId,
//   //       description:'customer charge'
//   //     });
//   // });
// };
const store = async (req, res) => {
  var data = {
    number: req.body[0].cardNumber,
    cvc: req.body[0].cvv,
    exp_month: +req.body[0].expmonth,
    exp_year: +req.body[0].expyear,
  };
  var stripeUserId = req.body[1].userStripeId;
  var userId = req.body[1]._id;
  var userName = req.body[1].userName;
  var userEmail = req.body[1].userEmail;
  if (stripeUserId == "") {
    stripe.customers
      .create({
        name: userName,
        email: userEmail,
      })
      .then(async (response) => {
        var customerId = response.id;
        await userModel
          .findByIdAndUpdate({ _id: userId }, { userStripeId: customerId })
          .then((response) => {
            createCard(data, customerId, res);
          })
          .catch((err) => {
            res.json(err.message);
          });
      })
      .catch((err) => res.json(err.message));
  } else {
    createCard(data, stripeUserId, res);
  }
  // var newCardData = new cardShema(req.body);
  // newCardData
  //   .save()
  //   .then((response) => {
  //     res.json({ message: "card stored in database" });
  //   })
  //   .catch((err) => {
  //     res.json({ message: "failed to save card" });
  //   });
};
const getCards = (req, res) => {
  cardShema
    .find()
    .then((response) => {
      res.json({
        response: response,
        success: true,
        message: "card data retrieved successfully",
      });
    })
    .catch((error) => {
      res.json({ message: "failed to get card", success: false });
    });
};
module.exports = {
  store,
  getCards,
};
