const { json } = require("body-parser");
const citySchema = require("../models/cityModel");
const store = (req, res, next) => {
  console.log(req.body);
  var newCountryData = new citySchema(req.body);
  newCountryData
    .save()
    .then((response) => {
      res.json({
        message: "city inserted sucessfully",
      });
    })
    .catch((err) => {
      res.json({
        message: "fail to save city",
      });
    });
};
const getCities = (req, res) => {
  citySchema
    .find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json({
        message: "an error occurred while retrieving cities",
      });
    });
};
const updateCity = (req, res) => {
  var data = req.body.areaCoords;

  var id = req.body._id;
  citySchema
    .findByIdAndUpdate({ _id: id }, { areaCoords: data })
    .then((response) => {
      // console.log(response);
      res.json({ message: "City coordinates successfully updated" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "fail to update city coordinates" });
    });
};
module.exports = {
  store,
  getCities,
  updateCity,
};
