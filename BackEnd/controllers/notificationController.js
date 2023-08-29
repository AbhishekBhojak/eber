const notificationSchema = require("../models/notificationModel");
const storeNotifications = (req, res) => {
  console.log("notificationData", req.body);
  var newnotifications = new notificationSchema(req.body);
  newnotifications
    .save()
    .then((response) => {
      res.json({ message: "data stored successfully" });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
};
const getNotifications = (req, res) => {};
module.exports = {
  storeNotifications,
  getNotifications,
};
