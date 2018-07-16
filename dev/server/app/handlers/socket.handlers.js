/* jshint esversion: 6 */

/** Options for onHandler:
    {
      io
      socketId
      eventName: string,
      callback: function,
      offEvents: string[]
    }
    */
function socketOnHandler(options) {

  const onHandler = options => {
    let informRoom = options => {
      let {
        io,
        room,
        eventName,
        data
      } = Object(options);

      /** Inform all sockets in room except the socket.*/
      if (io !== undefined && eventName !== undefined) {
        if (io.to(`/room${room}`) !== undefined) {
          io.to(`/room${room}`).emit(eventName, data);
        } else {
          console.warn("Cannot inform room.");
        }
      }

      io = null;
      data = null;
    };

    let {
      io,
      socketId,
      eventName,
      callback,
      offEvents,
      inform
    } = Object(options);

    let socket = io.sockets.connected[String(socketId)];

    socket.on(eventName, data => {
      socket.removeAllListeners(eventName);
      if (Array.isArray(offEvents)) {
        offEvents.forEach(eventName => {
          socket.removeAllListeners(eventName);
        });
      }

      if (inform === Object(inform)) {
        inform.data = data;
        informRoom(inform);
      }

      if (typeof callback === "function") {
        callback(data);
      }

      socket = null;
      offEvents = null;
      callback = null;
    });

    io = null;
  };

  return onHandler(options);
}

function socketEmitHandler (options) {
  const emitHandler = opt => {
    let {
      emit,
      events,
      socketId,
      io
    } = Object(opt);

    // console.log("I will emit to : " + socketId + "event: " + emit.eventName + "about: " + JSON.stringify(emit.data));
    // io.sockets.connected[String(socketId)].emit(emit.eventName, emit.data);
    // io.to(io.sockets.connected[String(socketId)]).emit(emit.eventName, emit.data);
    // io.to(socketId).emit(emit.eventName, emit.data);
    let socket = io.sockets.connected[String(socketId)];
    if (socket !== undefined) {
      socket.emit(emit.eventName, emit.data);
      socket = null;
      if (Array.isArray(events)) {
        events.forEach(event => {
          socketOnHandler({
            "io": io,
            "socketId": socketId,
            "eventName": event.eventName,
            "callback": event.callback
          });
        });
      }
      socket = null;
    } else {
      console.warn(`socket ${socketId} is not connected.`);
    }

    events = null;
    io = null;
    emit = null;
  };

  return emitHandler(options);
}

module.exports = {
  socketOnHandler: options => socketOnHandler(options),
  socketEmitHandler: options => socketEmitHandler(options)
};
