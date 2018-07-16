/* jshint esversion: 6 */
class Socket {
  constructor (
    socketFactory,
    roomEvents
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      roomEvents
    });
  }

  sit(options) {
    let {placeId, success, failure} = options;
    options.emit = {
      eventName: this.roomEvents.reqTakePlace,
      data: {
        placeId: placeId
      }
    };
    options.events = [
      {
        eventName: this.roomEvents.resTakePlaceSuccess,
        callback: data => {
          success(data);
          success = null;
          failure = null;
          // this.listenAskForStart();
        }
      },
      {
        eventName: this.roomEvents.resTakePlaceFailure,
        callback: data => {
          failure(data);
          success = null;
          failure = null;
          // this.listenAskForStart();
        }
      }
    ];
    this.socketFactory.emitHandler(options);
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomPlayersSocket", Socket);
