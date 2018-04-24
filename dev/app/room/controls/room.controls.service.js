/* jshint esversion: 6 */
class RoomControlsService {
  constructor (
    roomSocket,
    routerGoService,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      roomSocket,
      routerGoService,
      userData
    });
  }

  leave () {
    this.roomSocket.leaveRoom({
      success: () => {
        this.routerGoService.go();
      }
    });
  }
}

angular
  .module("roomModule")
  .service("roomControlsService", RoomControlsService);
