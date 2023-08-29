const express = require("express");
const loginController = require("../controllers/loginControllers");
const route = express.Router();
route.post("/storeAdmin", loginController.store);
route.post("/findAdmin", loginController.find);
module.exports = route;
