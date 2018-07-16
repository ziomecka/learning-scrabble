/* jshint esversion: 6 */
module.exports = class RoomControlsController {
  constructor (
    roomService
  ) {
    "ngInject";

    Object.assign(this, {
      roomService
    });
  }

  $onInit () {
    this.game = this.roomService.collection;
    console.log(this.game);
  }
};
