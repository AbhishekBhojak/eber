const countrySchema = require("../models/countryModel");
// show all countryData
const index = (req, res, next) => {
  countrySchema
    .find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json({
        message: "an error occurred while getting data",
      });
    });
};
const findCountry = async (req, res) => {
  var query = req.body.query.toString();
  console.log(query);
  // if (query == "") {
  //   return;
  // }
  const regexQuery = { $regex: query, $options: "i" };
  let response;
  try {
    if (query) {
      response = await countrySchema.find({
        $or: [{ countryName: regexQuery }, { countryCode: regexQuery }],
      });
    } else {
      response = await countrySchema.find();
    }
    console.log("length", response.length);
    res.json(response);
  } catch (err) {
    res.json({ message: err.message, success: false });
  }
  // countrySchema
  //   .find({ countryName: regexQuery })
  //   .then((response) => {
  //     res.json(response);
  //   })
  //   .catch((err) => {
  //     res.json({ message: err.message, success: false });
  //   });
};
const search = (req, res) => {
  console.log(req.body);
  var country = req.body.country;
  countrySchema
    .findOne({ countryName: country })
    .then((response) => {
      console.log("country-18", response);
      if (response != null) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
const store = (req, res, next) => {
  console.log(req.body);
  var newCountryData = new countrySchema(req.body);
  newCountryData
    .save()
    .then((response) => {
      res.json({
        message: "data inserted sucessfully",
      });
    })
    .catch((err) => {
      res.json({
        message: "fail to save data",
      });
    });
};
module.exports = {
  index,
  store,
  search,
  findCountry,
};
