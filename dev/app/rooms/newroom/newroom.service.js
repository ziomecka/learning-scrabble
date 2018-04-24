/* jshint esversion: 6 */
class NewroomService {
  constructor (
    newroomSocket,
    routerGoService,
    routerStates,
    roomsService
  ) {
    "ngInject";

    Object.assign(this, {
      newroomSocket,
      routerGoService,
      routerStates,
      roomsService
    });
  }

  createRoom (options) {
    let {data: {name, numberPlaces}} = Object(options);

    this.newroomSocket.createRoom({
      data: {
        name: name,
        numberPlaces: numberPlaces,
        createGame: true, // game will be created
        joinRoom: true, // user will join the room
      },
      success: data => {
        /** If the room is created transfer user to room's state. */
        this.routerGoService.go({
          state: this.routerStates.room,
          roomId: data.roomId,
          newroom: true // TODO out?
        });
      },
      failure: () => {
        this.roomsService.buttonsDisabled = false;
      }
    });
  }
}

angular
  .module("roomsModule")
  .service("newroomService", NewroomService);
