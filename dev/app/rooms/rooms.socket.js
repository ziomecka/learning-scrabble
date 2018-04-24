/* jshint esversion: 6 */
class RoomsSocket {
  constructor (
    socketFactory,
    roomsEvents,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      roomsEvents,
      routerGoService
    });
  }

  getRoomDetails (options) {
    options = Object(options);
    options.emit = {
      eventName: this.roomsEvents.reqJoinedRoomDetails,
      data: {
        roomId: options.roomId
      }
    };
    options.events = [
      {
        eventName: this.roomsEvents.resJoinedRoomDetails,
        callback: options.success,
        offEvents: []
      },
      // TODO failure
    ];

    this.socketFactory.emitHandler(options);
  }

  /** Join room and listen to room details */
  joinRoom (options) {
    let {data, success} = options;

    let successCallback = data => {
      success();
      this.routerGoService.go({
        state: auhtorizationStates.room,
        roomId: data.roomId
      });
    };

    options.emit = {
      eventName: this.roomsEvents.reqJoinRoom,
      data: data
    };

    options.events = [
      {
        eventName: this.roomsEvents.resRoomJoinedSuccess,
        callback: successCallback,
        offEvents: []
      },
      // TODO failure
    ];

    this.socketFactory.emitHandler(options);
  }
}

angular
  .module("roomsModule")
  .service("roomsSocket", RoomsSocket);
