const { io, express, app, server } = require("./socket.js");
const session = require("express-session");
const cron = require("./cron.js");
const mongodb_session = require("connect-mongodb-session")(session);
const countryRoutes = require("./routes/countryRoutes");
const vehiclePriceRoutes = require("./routes/vehiclePriceRoutes");
const cityRoutes = require("./routes/cityRoutes");
const vehicleRoutes = require("./routes/vehicleTypeRoutes");
const createRideRoutes = require("./routes/createRideRoutes");
const cardRoutes = require("./routes/cardRoutes");
const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingRoutes = require("./routes/settingRoutes.js");
// const rideHistoryRoutes = require("./routes/rideHistoryRoutes.js");
const loginRoutes = require("./routes/loginRoutes.js");
const bodyParser = require("body-parser");
const mongoose = require("./dataBase/db");
const cors = require("cors");
const path = require("path");
const userSchema = require("./models/userModel");
require("dotenv").config();
const port = process.env.PORT;
const url = process.env.URL;
const publicPath = path.join(__dirname, "./assets");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:4200" }));
app.post("/Login", async (req, res) => {
  var name = req.body.admin;
  var password = req.body.password;

  // console.log(req.body);
  userSchema
    .find({
      type: "admin",
    })
    .then((response) => {
      if (password == response[0].password && name == response[0].type) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
      // if (lastActivityTime) {
      //   const currentTime = new Date().getTime();
      //   const lastActivityTime = new Date(req.session.lastActivity).getTime();

      //   if (currentTime - lastActivityTime > idleTime) {
      //     req.session.destroy();
      //     alert("your session has been Expired");
      //   }
      // }
    })
    .catch((err) => {
      res.json({ message: "fail to login", success: false });
    });
});
app.use((err, req, res, next) => {
  // Log the error or handle it in an appropriate way
  console.error(err);
  // Send an error response to the client
  res.status(err.status || 500).send(err.message || "Internal Server Error");
});
app.use("/country", countryRoutes);
app.use("/city", cityRoutes);
app.use("/notification", notificationRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/vehiclePrice", vehiclePriceRoutes);
app.use("/createRide", createRideRoutes);
app.use("/user", userRoutes);
// app.use("/rideHistory", rideHistoryRoutes);
app.use("/setting", settingRoutes);
app.use("/driver", driverRoutes);
app.use("/card", cardRoutes);
app.use("/login", loginRoutes);
server.listen(port, () => {
  console.log(`app listening on ${port}`);
});
