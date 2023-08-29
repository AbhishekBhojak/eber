const bcrypt = require("bcrypt");
const loginSchema = require("../models/loginModel");
const store = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(req.body.adminPassword, salt);
  console.log(hashedPassword);
  var data = {
    adminName: req.body.adminName,
    password: hashedPassword,
  };
  var storeAdmin = new loginSchema(data);
  // storeAdmin.findOne({adminName:data.adminName}).then((response) => {
  //   console.log(respose)
  // })
  storeAdmin
    .save()
    .then((response) => {
      res.json({ message: "admin saved successfully", success: true });
    })
    .catch((err) => {
      res.json({ message: err.message.split(" ")[1], success: false });
    });
};
const find = async (req, res) => {
  console.log("login-12", req.body);
  var data = {
    adminName: req.body.adminName,
    // password: req.body.adminPassword,
  };
  console.log("///////////////////////////////");
  loginSchema
    .findOne(data)
    .then(async (respose) => {
      const isPasswordMatch = await bcrypt.compare(
        req.body.adminPassword,
        respose.password
      );
      console.log(isPasswordMatch);
      if (isPasswordMatch) res.json({ message: "loginIn", success: true });
      else res.json({ message: "wrong Credentials", success: false });
    })
    .catch((err) => {
      res.json({ message: err.message, success: false });
    });
};
// function UpdateAll() {
//   loginSchema.find().then((response) => {
//     response.forEach(async (data) => {
//       if (data.password.length < 10) {
//         console.log(data.adminName);
//         const salt = await bcrypt.genSalt(10);
//         const newPassword = await bcrypt.hash(data.password, salt);
//         await loginSchema.findByIdAndUpdate(
//           { _id: data._id },
//           { password: newPassword }
//         );
//       }
//     });
//   });
// }
module.exports = { store, find };
