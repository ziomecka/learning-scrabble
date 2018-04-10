/* jshint esversion: 6 */
angular
  .module("roomsModule")
  .service("roomsService", [
    "$rootScope",
    "roomsSocket",
    function ($rootScope, roomsSocket) {
      // this.updateRooms = data => {
      //   this.rooms.push(data);
      //   console.log(`Rooms: ${this.rooms}`);
      // };

      this.joinRoom = id => roomsSocket.joinRoom({
        id: id,
        callbacks: {
          successJoinRoom: data => {
            // TODO
          }
        }
      });
    }
  ]);
