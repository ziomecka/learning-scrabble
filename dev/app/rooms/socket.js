/* jshint esversion: 6 */
class RoomsSocket {
  constructor (
    socketFactory,
    roomsEvents,
    routerGoService,
    routerStates
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      roomsEvents,
      routerGoService,
      routerStates
    });
  }

  getRoomDetails (options) {
    let {success, failure, data} = Object(options);
    options.emit = {
      eventName: this.roomsEvents.reqJoinedRoomDetails,
      data: data
    };
    options.events = [
      {
        eventName: this.roomsEvents.resJoinedRoomDetailsSuccess,
        callback: data => {
          success(data);
          // success = null;
          // failure = null;
        },
        offEvents: []
      },
      // TODO failure
      {
        eventName: this.roomsEvents.resJoinedRoomDetailsFailure,
        callback: data => {
          failure(data);
          // success = null;
          // failure = null;
        },
        offEvents: []
      }
    ];

    this.socketFactory.emitHandler(options);
  }

  roomJoined () {
    // let {data, success} = options;
    let options = {};
    options.emit = {
      eventName: this.roomsEvents.reqRoomJoined,
      // data: {
      //   roomId: options.roomId
      // }
    };

    this.socketFactory.emitHandler(options);
    // success();

    // data = null;
    // success = null;
    options = null;
  }

  /** Join room and listen to room details */
  joinRoom (options) {
    let {data, success, failure} = options;

    options.emit = {
      eventName: this.roomsEvents.reqJoinRoom,
      data: data
    };

    options.events = [
      {
        eventName: this.roomsEvents.resRoomJoinedSuccess,
        callback: data => {
          success(data);
          success = null;
          failure = null;
        },
        offEvents: []
      },
      {
        // TODO failure
        eventName: this.roomsEvents.resRoomJoinedFailure,
        callback: data => {
          failure(data);
          success = null;
          failure = null;
        },
        offEvents: []
      }
    ];

    this.socketFactory.emitHandler(options);
  }
}

angular // eslint-disable-line no-undef
  .module("roomsModule")
  .service("roomsSocket", RoomsSocket);
