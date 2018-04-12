/* jshint esversion: 6 */
angular
  .module("app")
  .service("socketService", [
    "$rootScope",
    "authorizationService",
    function ($rootScope, authorizationService) {

      /** io is avaialable thanks to socket.io-client */
      let socket = io();

      this.on = (event, callback) => {
        socket.on(event, function() {
          let args = arguments;
          $rootScope.$apply(() => {
            callback.apply(socket, args);
          });
        });
      };

      this.off = (event) => {
        socket.off(event);
      };


      this.emit = (event, data, callback) => {
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

      this.onHandler = options => {
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

      this.emitHandler = options => {
        options = Object(options);
        let {
          emit,
          events
        } = options;

        /** Emit roomID and login */
        ({login: emit.data.login, roomId: emit.data.roomId} = authorizationService);

        this.emit(emit.eventName, emit.data);
        if (Array.isArray(events)) {
          events.forEach(event => {
            this.onHandler(event.eventName, event.callback, event.offEvents);
          });
        }
      };

      this.disconnect = () => socket.disconnect();

      this.getSocket = () => this.socket;
  }
]);
