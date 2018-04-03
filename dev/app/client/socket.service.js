/* jshint esversion: 6 */
angular
  .module("app")
  .service("socketService", [
    "$rootScope",
    function ($rootScope) {

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

      this.emit = (event, data, callback) => {
        socket.emit(event, data, () => {
          const args = arguments;
          $rootScope.$apply(() => {
            callback.apply(socket, args);
          });
        });
      };

      this.disconnect = () => socket.disconnect();

      this.getSocket = () => this.socket;
  }
]);
