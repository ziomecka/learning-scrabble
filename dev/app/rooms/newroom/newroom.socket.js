/* jshint esversion: 6 */
class NewroomSocket {
  constructor (
    socketService,
    roomsEvents,
    $stateParams,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      socketService,
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

    this.socketService.emitHandler(options);
  }
}

angular
  .module("roomsModule")
  .service("newroomSocket", NewroomSocket);
