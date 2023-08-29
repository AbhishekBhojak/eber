require("dotenv").config();
const createRideSchema = require("../models/createRideModel");
const driverSchema = require("../models/driverModel");
const userSchema = require("../models/userModel");
const vehicleSchema = require("../models/vehicleTypeModel");
const cardSchema = require("../models/cardModel");
const seckret_key = process.env.seckretKey;
const stripe = require("stripe")(seckret_key);
const sendMessage = require("../controllers/userController");
// const objectToCsv = require("object-to-csv");
const fs = require("fs");
var Socket;

const { io } = require("../socket");
const objectToCsv = require("object-to-csv");
const { create } = require("domain");
const { match } = require("assert");
io.on("connection", (socket) => {
  Socket = socket;
  Socket.on("timeOver", async (data) => {
    // setTimeout(() => {
    Socket.emit("notification", data);
    // }, 500);
    // console.log("notification emited");
    // console.log("in 16 crc:", data);
    await createRideSchema.findByIdAndUpdate(
      { _id: data._id },
      {
        currentStatus: "booked",
        driverId: null,
        newRide: false,
      }
    );
    if (data.driverId) {
      await driverSchema.findByIdAndUpdate(
        { _id: data.driverId._id },
        { currentRide: "", driverStatus: true }
      );
    } else {
      return;
    }
  });
});
const store = (req, res) => {
  var data = req.body;
  if (req.body.cardId) {
    cardSchema.find({ _id: req.body.cardId }).then((response) => {
      stripe.charges.create(
        {
          amount: req.body.serviceCost * 100,
          customer: response[0].userId,
          currency: "inr",
          source: response[0].cardId,
          description: "user Charged",
        },
        function (err, charge) {
          if (err) {
            res.json({ message: "card not created", success: false });
          } else {
            req.body.chargeId = charge.id;
            var ridedata = new createRideSchema(req.body);
            ridedata
              .save()
              .then((response) => {
                var htmlMessage = `<!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <title>Uber Invoice</title>
                  <style>
                    /* Define your CSS styles here */
                    body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                    }
                
                    .invoice {
                      border: 1px solid #ccc;
                      padding: 20px;
                      max-width: 600px;
                      margin: 0 auto;
                    }
                
                    .invoice-header {
                      text-align: center;
                    }
                
                    .invoice-details {
                      margin-top: 20px;
                    }
                
                    .invoice-details span {
                      display: inline-block;
                      width: 150px;
                      font-weight: bold;
                    }
                
                    .invoice-items {
                      margin-top: 20px;
                    }
                
                    .invoice-item {
                      display: flex;
                      justify-content: space-between;
                    }
                
                    .invoice-item span {
                      width: 70%;
                    }
                
                    .invoice-item .amount {
                      text-align: right;
                    }
                
                    .invoice-total {
                      margin-top: 20px;
                      text-align: right;
                    }
                  </style>
                </head>
                
                <body>
                  <div class="invoice">
                    <div class="invoice-header">
                      <h1 style='background-color:rgb(62, 242, 242);'>Eber Invoice</h1>
                    </div>
                    <div class="invoice-details">
                      <span>Customer Id:</span>
                      <span>${data.userId}</span>
                    </div>
                    <div class="invoice-total">
                      <span><strong>Total Amount:</strong></span>
                      <span class="amount"><strong>${data.serviceCost}</strong></span>
                    </div>
                  </div>
                </body>
                
                </html>
                `;
                sendMessage.nodeMailerMessage(htmlMessage);
                res.json({
                  message: "trip charged",
                  success: true,
                });
              })
              .catch((err) => {
                res.json({ message: err.message, success: false });
              });
          }
        }
      );
    });
  } else {
    var newCreateRideData = new createRideSchema(req.body);
    newCreateRideData
      .save()
      .then((response) => {
        Socket.emit("Booked", { status: "Booked" });
        res.json({
          message: "createRide data saved successfully",
          success: true,
        });
      })
      .catch((err) => {
        res.json({
          message: "failed to save createRide data",
          success: false,
        });
      });
  }
};
const cancelRequest = (req, res) => {
  var id = req.body.id;
  var driverId = req.body.driverId;
  var cancelledBy = req.body.cancelledBy;
  var data = {};
  data.currentStatus = req.body.currentStatus;
  data.assignType = req.body.assignType;
  data.driverId = null;
  if (
    req.body.assignType === "auto" &&
    req.body.cancelledBy == "Driver cancel"
  ) {
    data.currentStatus = "pending";
    data.cancelDriver = [...req.body.data.cancelDriver, driverId];
    data.driverId = null;
  }
  if (req.body.driverId != null) {
    var trb = {};
    trb.currentRide = "";
    trb.driverStatus = true;
    driverSchema
      .findByIdAndUpdate({ _id: driverId }, trb)
      .then((response) => {
        // createRideSchema
        //   .findByIdAndUpdate({ _id: id }, data)
        //   .then((response) => {
        //     res.json({
        //       message: "trip status updated successfully",
        //       success: true,
        //     });
        //   })
        //   .catch((err) => {
        //     res.json({ message: err.message, success: false });
        //   });
      })
      .catch((err) => {
        res.json({ message: err.message, success: false });
      });
  }
  createRideSchema
    .findByIdAndUpdate({ _id: id }, data, { new: true })
    .then((response) => {
      res.json({ data: response, message: "trip canceled", success: true });
    })
    .catch((err) => {
      res.json({ message: err.message, success: false });
    });
};
const acceptRequest = (req, res) => {
  // console.log("322", req.body);
  var message;
  // console.log(req.body);
  var status = req.body.currentStatus;
  switch (status) {
    case "pending": {
      status = "accepted";
      message = "driver accepted your Request";
      break;
    }
    case "accepted": {
      status = "arrived";
      message = "driver arrived";
      break;
    }
    case "arrived": {
      status = "picked";
      break;
    }
    case "picked": {
      status = "started";
      message = "driver started trip";
      break;
    }
    case "started": {
      status = "completed";
      message = "driver finished trip";
      break;
    }
  }
  var id = req.body.id;
  var data = {};
  if (req.body.currentStatus === "completed") {
    data.driverId = null;
  }
  // console.log(status);
  data.currentStatus = status;
  createRideSchema
    .findByIdAndUpdate({ _id: id }, data)
    .then(async (response) => {
      if (status == "completed") {
        await driverSchema.findByIdAndUpdate(
          { _id: req.body.driverId },
          { currentRide: "", driverStatus: true }
        );
        // cardSchema.generatePayment();
      }
      sendMessage.twilioMessage(message);

      res.json({ message: "trip status updated ", success: true });
    })
    .catch((err) => {
      res.json({ message: err.message, success: false });
    });
};
const getCreateRideData = async (req, res) => {
  console.log(req.body);
  var fromdt = req.body.from;
  var todt = req.body.to;
  var query = req.body.query;
  var limit = req.body.pagelimit;
  const regexQuery = { $regex: query, $options: "i" };
  var page = req.body.pageno;
  var skip = (page - 1) * limit;
  var data = {};
  var from;
  var to;
  var count;
  try {
    if (fromdt != undefined && todt != undefined) {
      from = fromdt;
      to = todt;
    } else {
      from = "1/1/2000";
      to = "31/12/2050";
    }
    if (query != "" || fromdt || todt) {
      data = await createRideSchema.aggregate([
        {
          $match: {
            $and: [
              { date: { $gte: from, $lte: to } },
              { currentStatus: { $nin: ["cancelled", "completed"] } },
            ],
          },
        },
        {
          $lookup: {
            from: "userlists",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "vehicletypes",
            localField: "serviceId",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        {
          $unwind: "$vehicle",
        },
        {
          $match: {
            $and: [
              { currentStatus: { $nin: ["cancelled", "completed"] } },
              {
                $or: [
                  { pickUp: regexQuery },
                  { drop: regexQuery },
                  { currentStatus: regexQuery },
                  { serviceCost: regexQuery },
                  { distance: regexQuery },
                  { duration: regexQuery },
                  { date: regexQuery },
                  { time: regexQuery },
                  { "user.userName": regexQuery },
                  { "user.userPhone": regexQuery },
                  { "vehicle.vehicleName": regexQuery },
                  { $or: [{ date: { $in: [from, to] } }] },
                ],
              },
            ],
          },
        },
        {
          $project: {
            pickUp: 1,
            drop: 1,
            currentStatus: 1,
            serviceCost: 1,
            distance: 1,
            duration: 1,
            date: 1,
            time: 1,
            user: "$user.userName",
            userNo: "$user.userPhone",
            vehicle: "$vehicle.vehicleName",
          },
        },
      ]);
      // .skip(skip)
      // .limit(limit);
      count = data.length;
    } else {
      data = await createRideSchema
        .find({ currentStatus: { $nin: ["completed", "cancelled"] } })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "userId",
          select: "userName userImage userPhone",
        })
        .populate({
          path: "serviceId",
          select: "vehicleName",
        })
        .populate({
          path: "driverId",
          select: "driverName driverPhone driverProfile",
        });
      count = await createRideSchema
        .find({ currentStatus: { $nin: ["completed", "cancelled"] } })
        .count();
    }
    // if (date != undefined) {
    //   console.log(date.length);
    //   data = date;
    // }
    var datas = {
      data: data,
      count: count,
    };
    res.json(datas);
  } catch (err) {
    res.json({ message: err.message });
  }
};
const findCancelledRequest = async (req, res) => {
  console.log(req.body);
  var query = req.body.query;
  var fromdt = req.body.from;
  var todt = req.body.to;
  const regexQuery = { $regex: query, $options: "i" };
  var limit = req.body.pagelimit;
  var page = req.body.pageno;
  var skip = (page - 1) * limit;
  var data = {};
  var from;
  var to;
  var count;
  try {
    if (fromdt != undefined && todt != undefined) {
      from = fromdt;
      to = todt;
    } else {
      from = "1/1/2000";
      to = "31/12/2050";
    }
    if (query != "" || fromdt || todt) {
      data = await createRideSchema.aggregate([
        {
          $match: {
            $and: [
              { date: { $gte: from, $lte: to } },
              { currentStatus: { $in: ["cancelled", "completed"] } },
            ],
          },
        },
        {
          $lookup: {
            from: "driverlists",
            localField: "driverId",
            foreignField: "_id",
            as: "driver",
          },
        },
        {
          $lookup: {
            from: "userlists",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "vehicletypes",
            localField: "serviceId",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        {
          $project: {
            drop: 1,
            pickUp: 1,
            date: 1,
            currentStatus: 1,
            user: { $arrayElemAt: ["$user.userName", 0] },
            userNo: { $arrayElemAt: ["$user.userPhone", 0] },
            driver: { $arrayElemAt: ["$driver.driverName", 0] },
            driverNo: { $arrayElemAt: ["$driver.driverPhone", 0] },
            vehicle: { $arrayElemAt: ["$vehicle.vehicleName", 0] },
          },
        },
        {
          $match: {
            $or: [
              { drop: regexQuery },
              { pickUp: regexQuery },
              { date: regexQuery },
              { currentStatus: regexQuery },
              { vehicle: regexQuery },
              { driver: regexQuery },
              { driverNo: regexQuery },
              { user: regexQuery },
              { userNo: regexQuery },
              { $or: [{ date: { $in: [from, to] } }] },
            ],
          },
        },
      ]);
      // .skip(skip)
      // .limit(limit);
      count = data.length;
    } else {
      data = await createRideSchema
        .find({ currentStatus: { $in: ["cancelled", "completed"] } })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "driverId",
          select: "driverName driverEmail driverPhone driverProfile",
        })
        .populate({
          path: "userId",
          select: "userName userEmail userPhone userImage",
        })
        .populate({
          path: "serviceId",
          select: "vehicleName vehicleImage",
        });
      var count = await createRideSchema
        .find({ currentStatus: { $in: ["cancelled", "completed"] } })
        .count();
    }
    var datas = {
      data: data,
      count: count,
    };
    res.json(datas);
  } catch (err) {
    res.json({ message: err.message });
  }
};
const findReassignedRide = (req, res) => {
  // var count
  createRideSchema
    .find({ newRide: false, currentStatus: "booked" })
    .populate({
      path: "driverId",
      select: "driverName driverEmail driverPhone driverProfile",
    })
    .populate({
      path: "userId",
      select: "userName userEmail userPhone userImage",
    })
    .populate({
      path: "serviceId",
      select: "vehicleName vehicleImage",
    })
    .then((response) => {
      // count=response.length
      res.json(response);
    });
};
const setDriverForTrip = async (req, res) => {
  var data = {};
  // console.log("*************", req.body);
  data.driverId = req.body.driverId;
  data.currentStatus = req.body.currentStatus;
  data.assignType = req.body.assignType;
  data.assignBefore = [req.body.driverId];
  var assign = req.body.assignType;
  // console.log(assign);
  await createRideSchema.findByIdAndUpdate({ _id: req.body.tripId }, data);
  // .then(async (response) => {
  await driverSchema
    .findByIdAndUpdate(
      { _id: req.body.driverId },
      { currentRide: req.body.tripId }
      // { currentRide: req.body.tripId, driverStatus: false }
    )
    .then((response) => {
      res.json({ message: `assign to ${assign}`, success: true });
    })
    .catch((err) => {
      res.json({ message: err.message, success: false });
    });
  // if(assignType=='auto'){
  //   driverSchema.findByIdAndUpdate()
  // }
  // res.json({ message: `assign to ${assign}`, success: true });
  // })
  // .catch((err) => {
  //   res.json({ message: err.message, success: false });
  // });
};
const findRequestTrip = (req, res) => {
  createRideSchema
    .find({
      currentStatus: {
        $in: ["pending", "accepted", "arrived", "picked", "started"],
      },
    })
    .populate({
      path: "driverId",
      select: "driverName driverProfile driverPhone driverEmail",
    })
    .populate({
      path: "userId",
      select: "userName userEmail userImage userPhone",
    })
    .then((response) => {
      setTimeout(() => {
        Socket.emit("pending", { status: "pending" });
      }, 500);
      res.json(response);
    })
    .catch((err) => {
      res.json({ message: err.message });
      // console.log(err.message);
    });
};
const findDataByDate = (req, res) => {
  // console.log(req.body);
  var from = req.body.from;
  var to = req.body.to;
  createRideSchema
    .find({ date: { $in: [`${from}`, `${to}`] } })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
};
const searchInfo = async (req, res) => {
  // console.log(req.body);
  query = req.body.query;
  searchBy = req.body.searchBy;
  const regexQuery = { $regex: query, $options: "i" };
  if (searchBy == "status") {
    createRideSchema
      .find({ $or: [{ currentStatus: regexQuery }] })
      .then((response) => {
        if (response.length != 0) {
          res.json(response);
        } else {
          res.json({ sucess: false, message: "status not found" });
        }
      })
      .catch((error) => {
        message: error.message;
      });
  } else if (searchBy == "vehicle") {
    vehicleSchema.find({ vehicleName: regexQuery }).then((response) => {
      if (response.length != 0) {
        createRideSchema
          .find({ serviceId: response[0]._id })
          .then((response) => {
            if (response.length != 0) {
              res.json(response);
            } else {
              res.json({ sucess: false, message: "vehicle not found" });
            }
          })
          .catch((error) => {
            res.json({ message: error.message });
          });
      } else {
        res.json({ sucess: false, message: "no such vehicle available" });
      }
    });
  } else if (searchBy == "user name") {
    userSchema.find({ userName: regexQuery }).then((response) => {
      if (response.length != 0) {
        createRideSchema
          .find({ userId: response[0]._id })
          .then((response) => {
            if (response.length != 0) {
              res.json(response);
            } else {
              res.json({ success: false, message: "User Name not found" });
            }
          })
          .catch((err) => {
            message: err.message;
          });
      } else {
        res.json({ message: "No such user available", success: false });
      }
    });
  } else if (searchBy == "user number") {
    userSchema.find({ userPhone: regexQuery }).then((response) => {
      if (response.length != 0) {
        createRideSchema.find({ userId: response[0]._id }).then((response) => {
          if (response.length != 0) {
            res.json(response);
          } else {
            res.json({ success: false, message: "User Number not found" });
          }
        });
      } else {
        res.json({ success: false, message: "No such user available" });
      }
    });
  }
};
// const download = (req, res) => {
//   var data = req.body;
//   let oct = new objectToCsv({ data });
//   let csv = oct.getCSV();
//   console.log(csv);
// };

module.exports = {
  store,
  getCreateRideData,
  setDriverForTrip,
  findRequestTrip,
  cancelRequest,
  acceptRequest,
  findCancelledRequest,
  searchInfo,
  findDataByDate,
  findReassignedRide,
  // storeNotification,
  // getNotification,
};
