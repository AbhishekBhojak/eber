const driverSchema = require("../models/driverModel");
const createRideSchema = require("../models/createRideModel");
const mongoose = require("mongoose");
const store = (req, res) => {
  var data = {
    driverName: req.body.driverName,
    driverEmail: req.body.driverEmail,
    driverPhone: req.body.driverPhone,
    countryId: req.body.country,
    cityId: req.body.city,
  };
  if (req.file) {
    var img = req.file.mimetype.split("/");
    if (img[0] != "image") {
      res.json({ message: "only image files are supported" });
      return;
    } else {
      data.driverProfile = req.file.filename;
    }
  }
  var newDriver = new driverSchema(data);

  newDriver
    .save()
    .then((response) => {
      res.json({
        message: "driver saved successfully",
        success: true,
      });
    })
    .catch((err) => {
      res.json({ message: err.message.split(" ")[1], success: false });
    });
};
const findDriverForTrip = (req, res) => {
  driverSchema
    .find({
      driverStatus: true,
      currentRide: "",
      vehicleTypeId: req.body.serviceId._id,
      _id: { $nin: req.body.cancelDriver },
    })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
};
// const setTripForDriver = (req, res) => {
//   var data = {};
//   data.currentRide = req.body.tripId;
//   data.driverStatus = false;
//   driverSchema
//     .findByIdAndUpdate({ _id: req.body.driverId }, data)
//     .then((response) => {
//       res.json({ message: "trip updated successfully" });
//     })
//     .catch((err) => {
//       res.json({ message: err.message });
//     });
// };
const find = (req, res) => {
  console.log(req.body);
  var query = req.body.query;
  let filterAggregate;
  let regexQuery = { $regex: query, $options: "i" };
  // try {
  if (query) {
    filterAggregate = driverSchema;
    db.driverList
      .aggregate([
        {
          $lookup: {
            from: "countryList",
            localField: "countryId",
            foreignField: "_id",
            as: "country",
          },
        },
        {
          $unwind: "$country",
        },
        {
          $lookup: {
            from: "cityList",
            localField: "cityId",
            foreignField: "_id",
            as: "city",
          },
        },
        {
          $unwind: "$city",
        },
        {
          $lookup: {
            from: "vehicleType",
            localField: "vehicleTypeId",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        {
          $unwind: "$",
        },
        {
          $match: {
            $or: [
              { "country.countryName": regexQuery },
              { "city.cityName": regexQuery },
              { "vehicle.vehicleName": regexQuery },
              { "country.countryName": regexQuery },
              { driverName: regexQuery },
              { driverEmail: regexQuery },
              { driverPhone: regexQuery },
            ],
          },
        },
        {
          $project: {
            driverName: 1,
            driverEmail: 1,
            driverPhone: 1,
            driverStatus: 1,
            city: "$city.cityName",
            country: "$country.countryName",
            vehicle: "$vehicle.vehicleName",
          },
        },
      ])
      .then((response) => {
        console.log(response);
        // res.json(filterAggregate);
      })
      .catch((err) => {
        res.json({ message: err.message, success: false });
      });
    // console.log(filterAggregate);
    // .then((response) => {
    //   console.log(response);
    // })
    // .catch((err) => {
    //   console.log(err.message);
    // });
  }
  //   console.log(filterAggregate);
  //   res.json(filterAggregate);
  // // }
  //  catch (err) {
  //   console.log(err.message);
  // res.json(err.message);
};
const index = async (req, res) => {
  console.log(req.body);
  var query = req.body.query;
  var limit = req.body.pagelimit;
  var page = req.body.pageno;
  var skip = (page - 1) * limit;
  var data = {};
  var count;
  const regexQuery = { $regex: query, $options: "i" };
  try {
    if (query) {
      data = await driverSchema.aggregate([
        {
          $lookup: {
            from: "citylists",
            localField: "cityId",
            foreignField: "_id",
            as: "city",
          },
        },
        {
          $unwind: "$city",
        },
        {
          $lookup: {
            from: "countrylists",
            localField: "countryId",
            foreignField: "_id",
            as: "country",
          },
        },
        {
          $unwind: "$country",
        },
        {
          $lookup: {
            from: "vehicletypes",
            localField: "vehicleTypeId",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        {
          $unwind: "$vehicle",
        },
        {
          $match: {
            $or: [
              { driverName: regexQuery },
              { driverPhone: regexQuery },
              { driverEmail: regexQuery },
              { "vehicle.vehicleName": regexQuery },
              { "city.cityName": regexQuery },
              { "country.countryName": regexQuery },
            ],
          },
        },
        {
          $project: {
            driverProfile: 1,
            driverName: 1,
            driverEmail: 1,
            driverPhone: 1,
            driverStatus: 1,
            country: "$country.countryName",
            city: "$city.cityName",
            vehicle: "$vehicle.vehicleName",
          },
        },
      ]);
      // .skip(skip)
      // .limit(limit);
      count = data.length;
    } else {
      data = await driverSchema
        .find()
        .skip(skip)
        .limit(limit)
        .populate()
        .populate({
          path: "countryId",
          select: "countryName",
        })
        .populate({
          path: "cityId",
          select: "cityName",
        })
        .populate({
          path: "vehicleTypeId",
          select: "vehicleName",
        });
      count = await driverSchema.find().count();
    }
    var ans = {
      response: data,
      count: count,
    };
    console.log("243", ans.count);
    res.json(ans);
  } catch (e) {
    res.json({ message: e.message });
  }
  // var limit = req.body.pagelimit;
  // var page = req.body.pageno;
  // var skip = (page - 1) * limit;
  // driverSchema
  //   .find(filter)
  //   .skip(skip)
  //   .limit(limit)
  //   .populate({
  //     path: "countryId",
  //     select: "countryName",
  //   })
  //   .populate({
  //     path: "cityId",
  //     select: "cityName",
  //   })
  //   .populate({
  //     path: "vehicleTypeId",
  //     select: "vehicleName",
  //   })
  //   // }
  //   .then(async (response) => {
  //     var count = await driverSchema.find(filter).count();
  //     console.log(count);
  //     // console.log(response);
  //     res.json({
  //       response: response,
  //       count: count,
  //       message: "driver data loaded",
  //       success: true,
  //     });
  //   })
  //   // }
  //   .catch((err) => {
  //     res.json({ message: err.message, success: false });
  //   });
  // // }
};
const update = (req, res) => {
  console.log("110------------------------------");
  console.log(req.body);
  console.log("110------------------------------");
  var data = {};
  var status = true;
  if (req.file) {
    data.driverProfile = req.file.filename;
  }

  if (req.body) {
    data.driverName = req.body.Name;
    data.driverEmail = req.body.Email;
    data.driverPhone = req.body.Phone;
    data.countryId = req.body.Country;
    data.cityId = req.body.City;
    if (req.body.Vehicle != "") {
      data.vehicleTypeId = req.body.Vehicle;
    }
    if (req.body.Status == "aprove") {
      data.driverStatus = true;
    } else {
      data.driverStatus = false;
    }
  }
  console.log("*******128dv");
  console.log(data);
  var id = req.body._id;
  driverSchema
    .findByIdAndUpdate({ _id: id }, data)
    .then((response) => {
      res.json({
        message: "driver updated successfully",
        success: true,
      });
    })
    .catch((err) => {
      res.json({ message: "fail to update driver", success: false });
    });
};
const driverList = (req, res) => {
  driverSchema
    .find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json({ message: "fail to find driver list" });
    });
};
const Delete = (req, res) => {
  driverSchema
    .findByIdAndDelete(req.body)
    .then((driver) => {
      res.json({
        message: "driver deleted successfully",
        success: true,
      });
    })
    .catch((err) => {
      res.json({
        message: "failed to delete driver",
        success: false,
      });
    });
};
module.exports = {
  find,
  store,
  index,
  update,
  Delete,
  driverList,
  findDriverForTrip,
  // setTripForDriver,
};
