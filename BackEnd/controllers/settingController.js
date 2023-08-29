const settingSchema = require("../models/settingModel");
const index = (req, res) => {
  settingSchema
    .find()
    .then((response) => {
      res.json(response[0]);
    })
    .catch((err) => {
      res.json({ message: "failed to get setting value" });
    });
};
const update = (req, res) => {
  var data = {};
  if (req.body.time) {
    data.time = req.body.time;
  }
  if (req.body.stops) {
    data.stops = req.body.stops;
  }
  var id = req.body.id;
  settingSchema
    .findByIdAndUpdate({ _id: id }, data, { new: true })
    .then((response) => {
      console.log(response);
      res.json({ res: response, success: true });
    })
    .catch((err) => {
      res.json({
        message: err.message,
        success: false,
      });
    });
};
module.exports = {
  index,
  update,
};
