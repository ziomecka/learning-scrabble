/* jshint esversion: 6 */

/** New connections from clients. */
const socketIO = require("socket.io");
const server = require("./server.start").server;
const io = new socketIO(server, {
  "pingTimeout": 30000,
  "pingInterval": 30000,
  "transports": [
    "polling",
    "websocket",
    "flashsocket",
    "htmlfile",
    "jsonp-polling"
  ],
  "polling duration": 10
});

const connectionCallback = require("./callbacks/server.connection.callback");

io.on("connection", socket => {
  console.log(`Socket ${socket.id} is connected.`);
  connectionCallback({
    "socket": socket,
    "io": io
  });
});
