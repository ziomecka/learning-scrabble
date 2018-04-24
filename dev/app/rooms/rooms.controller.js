/* jshint esversion: 6 */
module.exports = class RoomsController {
  constructor (
    roomsSocket,
    roomsList,
    roomsService
  ) {
    "ngInject";

    Object.assign(this, {
      roomsSocket,
      roomsList,
      roomsService
    });
  }

  $onInit () {
    this.roomsService.initializeRooms(this.roomsList);
  }

  joinRoom (id) {
    this.roomsService.joinRoom(id);
  }

  updateRooms (data) {
    me.rooms.push(data);
  }
};
