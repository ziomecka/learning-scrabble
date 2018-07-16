const socketStates = require("../server.socket.states");
const serverEvents = require("../server.events");
const serverMessages = require("../server.messages");
const socketsManager = require("../../app/authorization/authorization.sockets.manager");
const serverRooms = require("../server.rooms");
const serverFactories = require("../server.socket.factories");

module.exports = options => {
  let {
    storedFactories,
    state,
    io,
    socket,
    collection
  } = options;

  let fromState = socketsManager.getProperty({
    "socketId": socket.id,
    "property": "state"
  });

  // socketsManager.updateSocket({
  //   [socket.id]: {
  //     state: state
  //   }
  // });

  // console.log("fromState:" + fromState);
  // console.log("toState:" + state);
  // console.log("collection:" + collection);

  let socketData = {};

  let startListen = options => {
    let {factory, data} = Object(options);

    /** Get socket factory */
    let sF = factory.socket({
      socket: socket,
      io: io,
      collection: collection,
      data: data
    });

    /** Listen to new state's events */
    if (sF.listen !== undefined && sF.destroy !== undefined) {
      sF.listen();
      console.log(serverMessages.listen({
        "state": sF.name,
        "socketId": socket.id
      }));
    }

    factory = null;
    data = null;
    sF = null;
  }

  let stopListen = factory => {
    let sF = factory.socket({socket: socket, io: io});
      sF.destroy();
    console.log(serverMessages.stopListen({
      "state": sF.name,
      "socketId": socket.id
    }));
    sF = null;
  }

  /** If state has changed */
  if (fromState !== state) {
    /** Stop listening to previous state's events */
    storedFactories.forEach(factory => {
      if(!socketStates[state].includes(factory)) {
        /** socketData stores data from previous socket */
        console.log("facctory.name: "+ factory.name)
        socketData[factory.name] = stopListen(serverFactories[factory]);
      }
     });

    /** Start listenening. */
    socketStates[state].forEach(factory => {
      if(!storedFactories.includes(factory)) {
        startListen({
          factory: serverFactories[factory],
          data: socketData
        });
      }
    })

    /** If state is included in server rooms then
        remove socket from the previous room.
        */
    if (serverRooms.includes(fromState)) {
      let roomName = `/${fromState}${socket.roomIdFrom? socket.roomIdFrom : ""}`;
      socket.leave(roomName);
      console.log(serverMessages.leftRoom({
        "socketId": socket.id,
        "roomName": roomName
      }));
    }

    /** If state is included in server rooms then
        join socket to the new room.
        */
      let roomName;
      if (state === "rooms") {
        roomName = "/rooms";
      } else if (state === "room") {
        roomName = `/room${String(socket.roomIdTo)}`;
      }
      if (roomName !== undefined) {
        socket.join(roomName);
        console.log(serverMessages.joinedRoom({
          "socketId": socket.id,
          "roomName": roomName
        }));
      }
  }

  /** Inform about changed state. */
  socket.emit(serverEvents.reqSocketStateChangedSuccess);

  socketData = null;
  storedFactories = null;
  io = null;
  socket = null;

  /** Return functions for destroying new listeners. */
  return [...socketStates[state]];
}
