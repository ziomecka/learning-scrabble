/* jshint esversion: 6 */
class NewroomSocket {
  constructor (
    socketFactory,
    roomsEvents,
    $stateParams,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      roomsEvents,
      $stateParams,
      userData
    });
  }

  createRoom (options) {
    let {
      data: {
        name,
        numberPlaces,
        createGame = true,
        joinRoom = true,
        collection = "scrabble"
      },
      success,
      failure
    } = options;

    this.$stateParams.numberPlaces = numberPlaces;

    options.emit = {
      eventName: this.roomsEvents.reqCreateNewroom,
      data: {
        name: name,
        numberPlaces: numberPlaces,
        login: this.userData.login,
        createGame: createGame,
        joinRoom: joinRoom,
        collection: collection
      }
    };

    options.events = [
      {
        eventName: this.roomsEvents.resCreateNewroomSuccess,
        callback: data => {
          success(data);
          success = null;
          failure = null;
        },
        offEvents: []
      },
      {
        eventName: this.roomsEvents.resCreateNewroomFailure,
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
  .service("newroomSocket", NewroomSocket);
