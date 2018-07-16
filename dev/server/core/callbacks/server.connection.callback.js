const serverMessages = require("../server.messages");
const serverEvents = require("../server.events");
const socketsManager = require("../../app/authorization/authorization.sockets.manager");
const stateChangedCallback = require("./server.status.changed.callback");
const disconnectCallback = require("./server.disconnect.callback");

/** On connection:
    Get IP and extra headers: 'x-app', 'x-login', 'x-authorized'.
    If xApp === scrabble, then:
      - Inform about the connection.
      - Register socket in socketsManager.
      - Listen to changes in socket's status.
      - Listen to disconnect.
    Else: disconnect.
    */
const validateHeader = socket => {
  const address = socket.conn.remoteAddress;
  const xApp = socket.handshake.headers["x-app"];
  const socketId = socket.id;
  /** If header "x-app" !== "scrabble" then close connection.
      By checking the 'x-app' header I can catch hits from e.g. proxy.
      */
  if (xApp !== "scrabble") {
    console.log(serverMessages.connectionFailure({
      "socketId": socketId,
      "address": address,
      "xApp": xApp
    }));
    return false;
  }
  console.log(serverMessages.connectionSuccess({
    "address": address,
    "xApp": xApp,
    "socketId": socketId
  }));
  return true;
}

module.exports = options => {
  let {socket, io} = options;
  let socketId = socket.id;
  let headers = socket.handshake.headers;

  if(validateHeader(socket)) {
    // console.log(`headers: ${JSON.stringify(headers)}`);
    const xLogin = headers["x-login"];
    const xAuthorized = headers["x-authorized"];
    const state = headers["x-state"];
    const reconnecting = headers["x-reconnecting"];
    const roomId = headers["x-roomid"];

    let stateFrom;

    if (reconnecting === "true" && xLogin !== undefined) {
      stateFrom = "disconnected";
      console.log(serverMessages.reconnectSuccess({
        "login": xLogin,
        "socketId": socketId
      }));
    }

    console.log(JSON.stringify(socketsManager));
    socketsManager.addSocket({
      "socketId": socketId,
      "login": xLogin,
      "authorized": xAuthorized,
      "state": stateFrom,
      "roomId": roomId
    });

    /** Inform about the connection. */
    socket.emit(serverEvents.resConnected, {id: socket.id});

    /** Functions for destroying socket factories. */
    let storedFactories = [];

    const callStateChange = data => {
      /** Turn on new listeners and turn off the previous ones.
          Store functions for destroying socket factories.
          */
      return stateChangedCallback({
        storedFactories: storedFactories,
        state: data.state,
        io: io,
        socket: socket,
        collection: data.collection
        // roomIdTo: data.roomIdTo,
        // roomIdFrom: data.roomIdFrom
      });
    };

    storedFactories = callStateChange({
      state: state,
      roomId: roomId
    });

    /** When socket's status changed. */
    socket.on(serverEvents.reqSocketStateChanged, data => {
      console.log(`received roomIdTo: ${data.roomIdTo} roomIdFrom: ${data.roomIdFrom}, collection: ${data.collection}`);
      socket.roomIdTo = data.roomIdTo;
      socket.roomIdFrom = data.roomIdFrom;
      storedFactories = callStateChange({
        state: data.state,
        collection: data.collection
      });
    });

    /** Listen to disconnect. */
    socket.on("disconnect", () => {
      /** Unregister socket in socketsManager */
      disconnectCallback({
        socket: socket,
        io: io
      });

      storedFactories = null;
      headers = null;
      socket = null;
      io = null;
    });
  } else {
    socket.disconnect();
  }
};
