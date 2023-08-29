const userSchema = require("../models/userModel");
var twilioNumber, fromMail;
const nodemailer = require("nodemailer");
const accountSid = "AC37c3acb107ce51b70bb92f4db89575d4";
const authToken = "0307bb61b4b7c043f424b32b2419f6e9";
const client = require("twilio")(accountSid, authToken);
const settingSchema = require("../models/settingModel");
settingSchema
  .findOne()
  .then((setting) => {
    // console.log(setting);
    twilioNumber = setting.twilioNumber;
    fromMail = setting.fromMail;
  })
  .catch((error) => {
    console.log(error.message);
  });
const store = (req, res) => {
  console.log("8", req.file);
  var data = {
    userName: req.body.name,
    userEmail: req.body.email,
    userPhone: req.body.mobile,
    countryId: req.body.country,
  };
  if (req.file) {
    var img = req.file.mimetype.split("/");
    if (img[0] != "image") {
      res.json({ message: "only image files are supported" });
      return;
    } else {
      data.userImage = req.file.filename;
    }
  }
  var newUser = new userSchema(data);
  newUser
    .save()
    .then((result) => {
      // console.log(result);
      res.json({ message: "user saved successfully", success: true });

      var htmlMessage = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>HTML Formatted Message</title>
    </head>
    <body>
      <h1>Hello!</h1>
      <p>From Eber</p>
      <p>successfull registered</p>
    </body>
  </html>
`;
      nodeMailerMessage(htmlMessage);
      twilioMessage("Hello from Twilio!, sucessfully registered");
    })
    .catch((err) => {
      // console.log({ error: err.message });
      res.json({
        // message: "only image are allowed",
        message: err.message.split(" ")[1],
        sucess: false,
      });
    });
};

function twilioMessage(message) {
  client.messages
    .create({
      body: message,
      from: twilioNumber,
      to: "+919737803149",
    })
    .then((message) => console.log("Message sent:", message.sid))
    .catch((error) => console.error("Error occurred:", error));
}
function nodeMailerMessage(htmlMessage) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: fromMail,
      pass: "zpuyblkjokpyyhef",
    },
  });
  const mailOptions = {
    from: fromMail,
    to: "abhishekvbhojakvj@gmail.com",
    subject: "Registers Sucessfully",
    html: htmlMessage,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
const index = (req, res) => {
  // console.log(req.body);
  var limit = req.body.pagelimit;
  var page = req.body.pageno;
  var skip = (page - 1) * limit;
  userSchema
    .find()
    .skip(skip)
    .limit(limit)
    .populate({
      path: "countryId",
      select: "countryName",
    })
    .then(async (response) => {
      var count = await userSchema.find().count();
      res.json([response, count]);
    })
    .catch((err) => {
      res.json({
        message: "fail to get user data from database",
        success: false,
      });
    });
};
const userNumber = (req, res) => {
  userSchema
    .find(req.params)
    .then((response) => {
      // console.log(response);
      res.json(response);
    })
    .catch((err) => {
      res.json({
        message: "fail to get user data from database",
        success: false,
      });
    });
};
const update = (req, res) => {
  var data = {};
  if (req.file) {
    data.userImage = req.file.filename;
  }
  if (req.body) {
    data.userName = req.body.name;
    data.userEmail = req.body.email;
    data.userPhone = req.body.mobile;
    data.countryId = req.body.country;
  }
  var id = req.body._id;
  console.log(data);
  // if (req.body) {
  //   userSchema
  //     .findOne({ userEmail: req.body.email })
  //     .then((response) => {
  //       if (response) {
  //         res.json({ message: "data already exists", success: false });
  //         console.log("116", response);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // } else {
  userSchema
    .findByIdAndUpdate({ _id: id }, data)
    .then((response) => {
      res.json({
        message: "user updated successfully",
        success: true,
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.json({ message: "failed to update user", success: false });
    });
};
const Delete = (req, res) => {
  userSchema
    .findByIdAndDelete(req.body)
    .then((user) => {
      res.json({
        message: "user deleted successfully",
        success: true,
      });
    })
    .catch((error) => {
      res.json({
        message: "failed to delete user",
        success: false,
      });
    });
};
module.exports = {
  store,
  index,
  update,
  Delete,
  userNumber,
  twilioMessage,
  nodeMailerMessage,
};
