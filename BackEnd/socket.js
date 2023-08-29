const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});
io.on("connection", (socket) => {
  console.log("socket connection is established", socket.id);
});
module.exports = { io, express, app, server };
