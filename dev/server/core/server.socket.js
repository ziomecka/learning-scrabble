/* jshint esversion: 6 */

/** New connections from clients.
    */
const socketIO = require("socket.io");
const server = require("./server.start").server;
const io = socketIO(server);
const serverEvents = require("./server.events");

const serverApp = require("../app/app.socket").serverApp;
const redis = require("../app/app.user").redis;


// const docCookies = require("../../vendor/cookies_min.js");

io.on("connection", socket => {
  // redis.flush();

  const cookies = require("../cookies/cookies")({socket: socket});
  // cookies.reqAuthorizationCookies();
  cookies.listenAuthorizationCookies();

  console.log(`User connected: ${socket.id}`);
  /** Inform about the connection */
  socket.emit(serverEvents.resConnected, {id: socket.id});
  socket.on("disconnect", () => console.log("user disconnected"));

  serverApp(socket);
});
