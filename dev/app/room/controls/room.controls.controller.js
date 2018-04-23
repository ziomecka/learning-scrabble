/* jshint esversion: 6 */
module.exports = class RoomControlsController {
  constructor (
    roomControlsService
  ) {
    "ngInject";

    Object.assign(this, {
      roomControlsService
    });
  }

  getup () {
    this.roomControlsService.getUp();
  }

  start () {
    this.roomControlsService.start();
  }

  leave () {
    this.roomControlsService.leave();
  }
};
