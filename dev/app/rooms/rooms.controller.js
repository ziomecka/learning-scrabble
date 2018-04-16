/* jshint esversion: 6 */
module.exports = class RoomsController {
  constructor (roomsSocket, roomsList, roomsService) {
    "ngInject";

    this.rooms = [];

    this.$onInit = () => {
      this.rooms = [...roomsList];
      roomsService.rooms = [...roomsList];
    };
}

joinRoom (id) {
  roomsService.joinRoom({
    id: id
    // callbacks: {
    //   successJoinRoom: data => {
    //     me.buttonsDisabled = false; //TODO not needed?
    //   }
    // }
  });
}

updateRooms (data) {
  me.rooms.push(data);
}

    // // TODO:
    // roomsSocket.createRoomSuccess(me.updateRooms);
};
