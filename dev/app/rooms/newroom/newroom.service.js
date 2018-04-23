/* jshint esversion: 6 */
class NewroomService {
  constructor (
    newroomSocket,
    routerGoService,
    routerStates
  ) {
    "ngInject";

    Object.assign(this, {
      newroomSocket,
      routerGoService,
      routerStates
    });
  }

  createRoom (options) {
    let {data: {name, numberPlaces}, failure} = Object(options);

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
          newroom: true
        });
      },
      failure: data => {
        /** Call success callback. */
        failure(data);
      }
    });
  }
}

angular
  .module("roomsModule")
  .service("newroomService", NewroomService);
