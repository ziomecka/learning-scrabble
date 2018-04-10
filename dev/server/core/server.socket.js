/* jshint esversion: 6 */
/** New connections from clients. */

const socketIO = require("socket.io");
const server = require("./server.start").server;
const io = socketIO(server);
// const appSocketFactory = require("../app/app.socket");
const authorizationSocketFactory = require("../app/authorization/authorization.socket");
const newuserSocketFactory = require("../app/newuser/newuser.socket");
const serverEvents = require("./server.events");

// const redisFactory = require("../app/authorization/authorization.redis");
const cookies = require("../app/cookies/cookies");
const socketsManagerFactory = require("../app/authorization/authorization.sockets.manager");

io.on("connection", socket => {
  // redisFactory.flush();

  /** Inform about the connection. */
  console.log(`User connected: ${socket.id}.`);
  socket.emit(serverEvents.resConnected, {id: socket.id});

  /** Listen authorization cookies. */
  cookies.listenAuthorizationCookies({
    success: data => socketsManagerFactory().update(data),
    socket: socket,
    io: io
  });

  /** Register socket. */
  socketsManagerFactory().register({socket: socket.id});

  authorizationSocketFactory.authorizationSocket({socket: socket, io: io}).listen();
  newuserSocketFactory.newuserSocket({socket: socket, io: io}).listen();

  socket.on("disconnect", () => {
    socketsManagerFactory().unregister({socket: socket.id});
    console.log("User disconnected.");
    /** Garbage collection */ // TODO
  });
});
