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
        joinRoom = true
      },
      success
    } = options;

    this.$stateParams.numberPlaces = numberPlaces;

    options.emit = {
      eventName: this.roomsEvents.reqCreateNewroom,
      data: {
        name: name,
        numberPlaces: numberPlaces,
        login: this.userData.login,
        createGame: createGame,
        joinRoom: joinRoom
      }
    };

    options.events = [
      {
        eventName: this.roomsEvents.resCreateNewroom,
        callback: success,
        offEvents: []
      },
      // TODO failure
    ];

    this.socketFactory.emitHandler(options);
  }
}

angular
  .module("roomsModule")
  .service("newroomSocket", NewroomSocket);
