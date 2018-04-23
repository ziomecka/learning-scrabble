/* jshint esversion: 6 */
class RoomsSocket {
  constructor (
    socketFactory,
    roomsEvents,
    $stateParams,
    routerGoService,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      roomsEvents,
      $stateParams,
      routerGoService,
      userData
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
    let {id, callbacks: {successJoinRoom}} = options;
    let successCallback = data => {
      successJoinRoom();
      this.routerGoService.go({
        state: auhtorizationStates.room,
        roomId: data.roomId
      });
    };

    options.emit = {
      eventName: this.roomsEvents.reqJoinRoom,
      data: {
        "id": id
      }
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
