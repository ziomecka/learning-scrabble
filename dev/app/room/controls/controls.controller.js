/* jshint esversion: 6 */
module.exports = class RoomControlsController {
  constructor (
    roomSocket,
    roomService,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      roomSocket,
      roomService,
      routerGoService
    });
  }

  getup () {
  }

  start () {
  }

  leave () {
    this.roomSocket.leaveRoom({
      callbacks: {
        success: () => {
          this.routerGoService.go();
        }
      },
      roomId: this.roomService.data.room.id
    });
  }
};
