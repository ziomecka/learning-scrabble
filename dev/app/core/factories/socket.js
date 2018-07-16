/* jshint esversion: 6 */
const socketFactory = (
  $rootScope,
  userData,
  serverEvents,
  $q,
  clientOptions,
  // $timeout,
  routerStates,
  routerGoService,
  $stateParams
) => {
  "ngInject";

  let socket;
  let id; //eslint-disable-line no-unused-vars

  /** To store arguments send in last socket emit. */
  let lastEmit = [];

  const logSocket = () => {
    const deferred = $q.defer();
    /** Set socket headers for connection. */
    let socketOptions = clientOptions({
      //
      // ,
      // "sync disconnect on unload": true,
      // // "transports": ["xhr-polling", "websocket"],
      "login": userData.login,
      "authorized": userData.authorized
    }).connect;


    /** io is avaialable thanks to socket.io-client */
    try {
      socket = io(socketOptions); //eslint-disable-line no-undef
    } catch(err) {
      deferred.reject();
    }

    socketOptions = null;

    let callbackDisconnect = () => {
      /** Clear id on diconnection. */
      id = undefined;

      /** Set socket headers for reconnection. */
      socket.io.opts.transportOptions =
      clientOptions({
        "state": lastEmit.length? userData.state : routerStates.home,
        "login": userData.login,
        "authorized": userData.authorized,
        "roomId": $stateParams.roomId
      }).reconnect.transportOptions;
    };

    let callbackReconnect = () => {
      // TODO improve - emit after receiving info
      // $timeout(() => {
        if (!lastEmit.length) {
          routerGoService.go({state: userData.state});
        } else {
          /** Repeat last "emit".
              Listeners are already regisstered.
              */
          emit.apply(null, lastEmit);
        }
      // }, 2000);
    };

    socket.on(serverEvents.resConnected, data => {
      /** Get socket id on connection. */
      $rootScope.$apply(() => {
        id = data.id;
      });

      socket.on("disconnect", () => {
        callbackDisconnect();
      });

      socket.on("reconnect", attemptNumber => {
        callbackReconnect(attemptNumber);
      });

      deferred.resolve();
    });

    return deferred.promise;
  };

  const on = (event, callback) => {
    socket.on(event, function () {
      const args = arguments;
      $rootScope.$apply(() => {
        callback.apply(socket, args);
      });
    });
  };

  const off = (event) => {
    socket.off(event);
  };

  const emit = (event, data, callback) => {
    /** Store in case connection interrupted. */
    // lastEmit = [event, data, callback];
    socket.emit(event, data, function () {
      const args = arguments;
      $rootScope.$apply(() => {
        callback.apply(socket, args);
        /** If answear received then clear the lastEmit. */
        // TODO correct - clear the right emit
        lastEmit = null;
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

    let handler = (eventName, callback, offEvents, infinity) => {
      on(eventName, data => {
        if (infinity === undefined) {
          off(eventName);
        }
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
      handler(options.eventName, options.callback, options.offEvents, options.infinity);
    }
  };

  /** Options for emitHandler:
      {
        emit: {
          eventName: string,
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
    let {
      emit: {
        data: data = {},
        eventName: eventName
      },
      events
    } = Object(options);

    /** Emit roomID and login */
    data.login = data.login? data.login : userData.login;
    data.roomId = data.roomId? data.roomId: userData.roomId;

    emit(eventName, data);
    if (Array.isArray(events)) {
      events.forEach(event => {
        onHandler(event);
      });
    }
  };


  const listen = listens => {
    listens.forEach(event => {
      onHandler({
        eventName: event.name,
        callback: event.callback,
        infinity: true
      });
    });
  };

  const stopListen = events => {
    events.forEach(event => {
      off(event);
    });
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
    listen: listen,
    stopListen: stopListen
    // removeListeners: removeListeners
  };
};

angular // eslint-disable-line no-undef
  .module("app")
  .factory("socketFactory", socketFactory);
