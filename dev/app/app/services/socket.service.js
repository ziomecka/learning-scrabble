/* jshint esversion: 6 */
const socketFactory = (
  $rootScope,
  userData,
  appEvents,
  $q,
  appGlobals
) => {
  "ngInject";

  let socket;
  let id;

  const logSocket = () => {
    const deferred = $q.defer();

    let socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            "x-app": appGlobals["x-app"]
          }
        }
      }
    };

    /** io is avaialable thanks to socket.io-client */
    socket = io(socketOptions);
    socketOptions = null;

    // TODO on connectin close all other sockets
    /** Get id on connection. */
    socket.on(appEvents.resConnected, data => {
      $rootScope.$apply(() => {
        id = data.id;
        // console.log("Socket connected, id: " + id);
      });

      /** Get id on diconnection. */
      socket.on("disconnect", () => {
        id = undefined;
        // console.log("Socket disconnected, id: " + id);
      });

      deferred.resolve();
    });

    return deferred.promise;
  };

  const on = (event, callback) => {
    socket.on(event, function() {
      let args = arguments;
      $rootScope.$apply(() => {
        callback.apply(socket, args);
      });
    });
  };

  const off = (event) => {
    socket.off(event);
  };

  const emit = (event, data, callback) => {
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

  const onHandler = options => {
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

  const emitHandler = options => {
    options = Object(options);
    let {
      emit: e,
      events
    } = options;

    /** Emit roomID and login */
    e.data = Object(e.data);
    ({login: e.data.login, roomId: e.data.roomId} = userData);

    emit(e.eventName, e.data);
    if (Array.isArray(events)) {
      events.forEach(event => {
        onHandler(event);
      });
    }
  };

  /** If array of events received then
      remove listeners for events,
      else remove all listeners.
      */
  // const removeListeners = events => {
  //   if (Array.isArray(events)) {
  //     events.forEach(event => {
  //       socket.off(event.eventName, event.callback);
  //     });
  //   } else {
  //     socket.off();
  //   }
  // };

  return {
    logSocket: logSocket,
    onHandler: onHandler,
    emitHandler: emitHandler,
    on: on,
    emit: emit,
    off: off,
    // removeListeners: removeListeners
  };
};

angular
  .module("app")
  .factory("socketFactory", socketFactory);
