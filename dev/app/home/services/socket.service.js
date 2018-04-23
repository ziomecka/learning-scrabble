/* jshint esversion: 6 */
const socketFactory = (
  $rootScope,
  userData,
  appEvents,
  $q
) => {
  "ngInject";

  let socket;
  let id;
  let on;
  let off;
  let emit;
  let onHandler;
  let emitHandler;

  const logSocket = () => {
    const deferred = $q.defer();
    /** io is avaialable thanks to socket.io-client */
    // TODO why twice https://stackoverflow.com/questions/31050511/client-connecting-twice-to-server-socket-io
    socket = io();

    // TODO on connectin close all other sockets
    /** Get id on connection. */
    socket.on(appEvents.resConnected, data => {
      $rootScope.$apply(() => {
        id = data.id;
        console.log("Socket connected, id: " + id);
      });


      /** Get id on diconnection. */
      socket.on("disconnect", () => {
        id = undefined;
        console.log("Socket disconnected, id: " + id);
      });

      deferred.resolve();
    });

    return deferred.promise;
  };

  on = (event, callback) => {
    socket.on(event, function() {
      let args = arguments;
      $rootScope.$apply(() => {
        callback.apply(socket, args);
      });
    });
  };

  off = (event) => {
    socket.off(event);
  };

  emit = (event, data, callback) => {
    socket.emit(event, data, () => {
      const args = arguments;
      $rootScope.$apply(() => {
        callback.apply(socket, args);
      });
    });
  };

  /** Options for onHandler:
  {
  callback: {
  eventName: string,
  callback: function,
  offEvents: string[]
}
}
*/

onHandler = options => {
  options = Object(options);

  let handler = (eventName, callback, offEvents) => {
    on(eventName, data => {
      off(eventName);
      if (Array.isArray(offEvents)) {
        offEvents.forEach(eventName => {
          off(eventName);
        });
      }
      if (callback) {
        callback(data);
      }
    });
  };

  if (options.eventName) {
    handler(options.eventName, options.callback, options.offEvents);
  }
};

/** Options for emitHandler:
{
  emit: {
    event: string,
    data: object
  },
  events: [
    {
      eventName: string,
      callback: function,
      offEvents: string[]
    }
  ]
}
*/

emitHandler = options => {
  options = Object(options);
  let {
    emit: e,
    events
  } = options;

  /** Emit roomID and login */
  ({login: e.data.login, roomId: e.data.roomId} = userData);

  emit(e.eventName, e.data);
  if (Array.isArray(events)) {
    events.forEach(event => {
      onHandler(event);
    });
  }
};

  return {
    logSocket: logSocket,
    onHandler: onHandler,
    emitHandler: emitHandler,
    on: on,
    emit: emit,
    off: off
  };
};

angular
  .module("app")
  .factory("socketFactory", socketFactory);
