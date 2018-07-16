/* jshint esversion: 6 */
class Service {
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
    let {success, failure, data} = options;
    let emitOptions = {
      emit: {
        eventName: this.appEvents.reqAllRooms,
        data: data
      },
      events: [
        {
          eventName: this.appEvents.resAllRoomsSuccess,
          callback: data => {
            success(data);
            success = null;
            failure = null;
          }
        },
        {
          eventName: this.appEvents.resAllRoomsFailure,
          callback: data => {
            failure(data);
            success = null;
            failure = null;
          }
        }
      ]
    };
    this.socketFactory.emitHandler(emitOptions);
  }
}

angular // eslint-disable-line no-undef
  .module("app")
  .service("appSocket", Service);
