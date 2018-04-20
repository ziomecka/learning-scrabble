/* jshint esversion: 6 */
class AppSocket {
  constructor (
    socketService,
    appEvents
  ) {
    "ngInject";

    Object.assign(this, {
      socketService,
      appEvents
    });
  }

  connection () {
    this.socketService.on(this.appEvents.resConnected, data => console.log("I'm connected"));
    this.socketService.on("disconnect", () => console.log("I have been disconnected"));
  }

  removeListeners () {
    this.socketService.getSocket().removeAllListeners();
  }

  getAllRooms (options) {
    let {callback} = options;
    this.socketService.emit(this.appEvents.reqAllRooms);
    this.socketService.on(this.appEvents.resAllRooms, data => callback(data));
  }
}

angular
  .module("app")
  .service("appSocket", AppSocket);
