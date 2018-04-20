/* jshint esversion: 6 */
class SocketService {
  constructor (
    $rootScope,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      $rootScope,
      userData
    });
  }

  /** io is avaialable thanks to socket.io-client */
  get socket () {
    return io();
  }

  on (event, callback) {
    this.socket.on(event, function() {
      let args = arguments;
      this.$rootScope.$apply(() => {
        callback.apply(socket, args);
      });
    });
  }

  off (event) {
    this.socket.off(event);
  }

  emit (event, data, callback) {
    this.socket.emit(event, data, () => {
      const args = arguments;
      this.$rootScope.$apply(() => {
        callback.apply(socket, args);
      });
    });
  }

    /** Options for onHandler:
        {
          callback: {
          eventName: string,
          callback: function,
          offEvents: string[]
        }
      }
      */

  onHandler (options) {
    options = Object(options);

    let handler = (eventName, callback, offEvents) => {
      this.on(eventName, data => {
        this.off(eventName);
        if (Array.isArray(offEvents)) {
          offEvents.forEach(eventName => {
            this.off(eventName);
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
  }

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

  emitHandler (options) {
    options = Object(options);
    let {
      emit,
      events
    } = options;

    /** Emit roomID and login */
    ({login: emit.data.login, roomId: emit.data.roomId} = userData);

    this.emit(emit.eventName, emit.data);
    if (Array.isArray(events)) {
      events.forEach(event => {
        this.onHandler(event);
      });
    }
  }

  disconnect () {
    this.socket.disconnect();
  }
}

angular
  .module("app")
  .service("socketService", SocketService);
