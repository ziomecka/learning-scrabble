/* jshint esversion: 6 */
/** New connections from clients. */

const socketIO = require("socket.io");
const server = require("./server.start").server;
const io = socketIO(server);

const serverEvents = require("./server.events");

// const redisFactory = require("../app/authorization/app.redis");
const cookies = require("../cookies/cookies");
const socketsManagerFactory = require("../app/authorization/app.sockets.manager");

io.on("connection", socket => {
  // redisFactory.flush();

  /** Inform about the connection. */
  console.log(`User connected: ${socket.id}.`);
  socket.emit(serverEvents.resConnected, {id: socket.id});

  /** Listen authorization cookies. */
  cookies.listenAuthorizationCookies({
    success: data => socketsManagerFactory().update(data),
    socket: socket
  });

  /** Register socket. */
  socketsManagerFactory().register({socket: socket.id});

  let serverApp = require("../app/app.socket").serverApp;

  serverApp(socket);

  socket.on("disconnect", () => {
    socketsManagerFactory().unregister({socket: socket.id});
    console.log("User disconnected.");
    /** Garbage collection */ // TODO
    serverApp = null;
  });
});
