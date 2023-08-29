const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    // Do something after successfully connected
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
module.exports = mongoose;
