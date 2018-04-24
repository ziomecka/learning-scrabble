/* jshint esversion: 6 */
class AppSocket {
  constructor (
    socketFactory,
    appEvents
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      appEvents
    });
  }

  getAllRooms (options) {
    let {callback} = options;
    this.socketFactory.emit(this.appEvents.reqAllRooms);
    this.socketFactory.on(this.appEvents.resAllRooms, data => {
      callback(data);
    });
  }
}

angular
  .module("app")
  .service("appSocket", AppSocket);
