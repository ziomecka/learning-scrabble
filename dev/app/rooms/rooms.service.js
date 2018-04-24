/* jshint esversion: 6 */
class RoomsService {
  constructor (
    roomsSocket
  ) {
    "ngInject";

    Object.assign(this, {
      roomsSocket
    });
  }
    // this.updateRooms = data => {
    //   this.rooms.push(data);
    //   console.log(`Rooms: ${this.rooms}`);
    // };

  joinRoom (id) {
    this.roomsSocket.joinRoom({
      id: id,
      callbacks: {
        successJoinRoom: data => {
          // TODO
        }
      }
    });
  }
}

angular
  .module("roomsModule")
  .service("roomsService", RoomsService);
