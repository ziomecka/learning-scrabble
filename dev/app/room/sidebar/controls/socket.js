/* jshint esversion: 6 */
class Socket {
  constructor (
    socketFactory,
    roomEvents,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      roomEvents,
      userData
    });
  }

  leaveRoom (options) {
    let {success, failure} = options;
    options.emit = {
      eventName: this.roomEvents.reqLeaveRoom
    };
    options.events = [
      {
        eventName: this.roomEvents.resLeaveRoomSuccess,
        callback: () => {
          success();
          success = null;
          failure = null;
        }
      },
      {
        eventName: this.roomEvents.resLeaveRoomFailure,
        callback: data => {
          failure(data);
          success = null;
          failure = null;
        }
      }
    ];
    this.socketFactory.emitHandler(options);
  }

  getUp (options) {
    let {placeId, success, failure} = options;

    options.emit = {
      eventName: this.roomEvents.reqGetUp,
      data: {
        placeId: placeId
      }
    };
    options.events = [
      {
        eventName: this.roomEvents.resGetUpSuccess,
        callback: data => {
          success(data);
          success = null;
          failure = null;
        }
      },
      {
        eventName: this.roomEvents.resGetUpFailure,
        callback: data => {
          failure(data);
          success = null;
          failure = null;
        }
      }
    ];
    this.socketFactory.emitHandler(options);
  }

  start (options) {
    let {success, failure} = options;
    /** Data not needed: ... */
    options.emit = {
      eventName: this.roomEvents.reqStart,
    };
    options.events = [
      {
        eventName: this.roomEvents.resStartSuccess,
        callback: data => {
          success(data);
          success = null;
          failure = null;
        }
      },
      {
        eventName: this.roomEvents.resStartFailure,
        callback: data => {
          failure(data);
          success = null;
          failure = null;
        }
      }
    ];
    this.socketFactory.emitHandler(options);
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomControlsSocket", Socket);
