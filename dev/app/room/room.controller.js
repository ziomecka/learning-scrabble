/* jshint esversion: 6 */
/** Initialised via ui-router */
module.exports = class RoomController {
  constructor (
    newroomDefaults,
    roomData,
    roomService
  ) {
    "ngInject";

    Object.assign(this, {
      newroomDefaults,
      roomData,
      roomService
    });
  }

  $onInit () {
    this.roomService.initializeRoom(this.roomData);
  }

  $onDestroy () {
    this.roomService.destroyRoom();
  }

  numberPlacesChanged(number) {
    this.roomService.numberPlacesChanged(number);
  }

  timeChanged(time) {
    this.roomService.timeChanged(time);
  }

  takePlace(data) {
    this.roomService.takePlace(data);
  }

  getUp() {
    this.roomService.getUp();
  }
};
