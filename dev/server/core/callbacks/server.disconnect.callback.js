const serverMessages = require("../server.messages");
const socketsManager = require("../../app/authorization/authorization.sockets.manager");

module.exports = options => {
  let {socket, io} = options;
  require("../../app/app.socket").socket({socket: socket, io: io}).stopListen();
  console.log(serverMessages.stopListen({
    state: socketsManager.getProperty({
      "socketId": socket.id,
      "property": "state"
    }),
    socketId: socket.id
  }));

  let login = socketsManager.getProperty({
    "socketId": socket.id,
    "property": "login"
  });

  /** Set state in redis. */
  // socketsManager.setState({
  //   "login": login,
  //   "state": "disconnected",
  // });

  /** Unregister socket in socketsManager - local memory */
  socketsManager.removeSocket({
    "login": login,
    "socketId": socket.id
  });

  console.log(serverMessages.disconnectionSuccess({
    socketId: socket.id
  }));

  socket = null;
  io = null;
};
