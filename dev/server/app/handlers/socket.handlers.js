/* jshint esversion: 6 */

/** Options for onHandler:
    {
      callback: {
        eventName: string,
        callback: function,
        offEvents: string[]
        inform: {
          room: string,
          eventName: string,
          data: object
      }
      }
    }
    */
function socketOnHandler(options) {
  const onHandler = options => {
    options = Object(options);

    let informRoom = (socket, room, eventName, data) => {
      /** Inform all sockets in room except the socket.*/
      socket.to(`/room${room}`).emit(eventName, data);
    };

    let onHandler = (socket, eventName, callback, offEvents, inform) => {
      socket.on(eventName, data => {
        socket.off(eventName);
        if (Array.isArray(offEvents)) {
          offEvents.forEach(eventName => {
            socket.off(eventName);
          });
        }

        if (inform === Object(inform)) {
          inform.socket = socket;
          informRoom(inform);
        }

        if (callback) {
          callback(data);
        }
      });
    };

    if (options.eventName) {
      onHandler(options.eventName, options.callback, options.offEvents);
    }
  };
  return options => onhandler(options);
}

function socketEmitHandler(options) {
  const emitHandler = options => {
    options = Object(options);
    let {
      emit,
      events,
      socket
    } = options;
    socket.emit(emit.eventName, emit.data);
    if (Array.isArray(events)) {
      events.forEach(event => {
        onHandler(socket, event.eventName, event.callback, event.offEvents);
      });
    }
  };
  return options => emitHandler(options);
}

module.exports = {
  socketOnHandler: socketOnHandler,
  socketEmitHandler: socketEmitHandler
};
