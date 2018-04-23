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
      callbacks: {
        success: () => {
          this.routerGoService.go();
        }
      },
      roomId: this.userData.roomId
    });
  }
}

angular
  .module("roomModule")
  .service("roomControlsService", RoomControlsService);
