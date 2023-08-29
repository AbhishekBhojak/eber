const cron = require("node-cron");
const driverSchema = require("./models/driverModel");
const createRideSchema = require("./models/createRideModel");
const settingSchema = require("./models/settingModel");
var Socket;
const { io } = require("./socket");
io.on("connection", (socket) => {
  Socket = socket;
  Socket.on("timeOvercron", async (ride) => {
    var rd = await createRideSchema.findById({ _id: ride._id });
    await assignDriverCron(rd);
  });
});
cron.schedule("*/30 * * * * *", async () => {
  console.log("-----Cron job running every 30 seconds!----");
  await iterateRides();
});
async function iterateRides() {
  console.log("in iterateRides");
  var settingData = await settingSchema.findOne();
  var nt = new Date(Date.now() - +settingData.time * 1000);
  var Driver;
  var ride;
  await createRideSchema
    .find({
      currentStatus: "pending",
      assignType: "auto",
      updatedAt: { $lte: nt },
    })
    .then(async (rides) => {
      console.log("18 ridelenght-", rides.length);
      if (rides.length > 0) {
        for (const ride of rides) {
          await assignDriverCron(ride);
        }
      } else {
        console.log("29", "no pending requests");
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
async function assignDriverCron(ride) {
  var cancelDriver;
  if (ride.cancelDriver) {
    cancelDriver = ride.cancelDriver;
  } else {
    cancelDriver = [];
  }
  await driverSchema
    .find({
      driverStatus: true,
      currentRide: "",
      vehicleTypeId: ride.serviceId,
      _id: { $nin: cancelDriver.concat(ride.assignBefore) },
    })
    .then(async (drivers) => {
      console.log("driverlength--", drivers.length);

      if (drivers.length > 0) {
        const driver = drivers[0];
        if (ride.driverId != null) {
          console.log("-----Removed-----");
          await driverSchema.findByIdAndUpdate(
            { _id: ride.driverId },
            { driverStatus: true, currentRide: "" }
          );
        }
        await createRideSchema.findByIdAndUpdate(
          { _id: ride._id },
          {
            driverId: driver._id,
            newRide: false,
            assignBefore: [...ride.assignBefore, driver._id],
          }
        );
        await driverSchema
          .findByIdAndUpdate(
            { _id: driver._id },
            { currentRide: ride._id, driverStatus: false }
          )
          .then((response) => {
            console.log("assigned driver...");
            Socket.emit("cronWork", {
              data: "cron changed the driver",
            });
          })
          .catch((err) => {
            console.log("316", err.message);
          });
      } else {
        if (ride.driverId != null) {
          console.log("-----Removed----else-");
          await driverSchema.findByIdAndUpdate(
            { _id: ride.driverId },
            { driverStatus: true, currentRide: "" }
          );
        }
        await createRideSchema.findByIdAndUpdate(
          { _id: ride._id },
          {
            currentStatus: "booked",
            assignBefore: [],
            driverId: null,
            assignType: "selected",
          }
        );
        Socket.emit("cronWork", { data: "toBooked" });
      }
    })
    .catch((err) => {
      console.log("137", err.message);
    });
}
