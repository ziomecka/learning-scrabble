/* jshint esversion: 6 */
angular
  .module("app")
  .service("appSocket", function (socketService, appEvents) {
    "ngInject";
    this.connection = () => {
      socketService.on(appEvents.resConnected, data => console.log("I'm connected"));
      socketService.on("disconnect", () => console.log("I have been disconnected"));
    };

    this.removeListeners = () => {
      socketService.getSocket().removeAllListeners();
    };

    this.getAllRooms = options => {
      let {callback} = options;
      socketService.emit(appEvents.reqAllRooms);
      socketService.on(appEvents.resAllRooms, data => callback(data));
    };
  }
);
