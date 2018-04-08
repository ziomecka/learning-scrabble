/* jshint esversion: 6 */
angular
  .module("roomsModule")
  .service("roomsService", [
    "$rootScope",
    "appTalkService",
    function ($rootScope, appTalkService) {
      // this.updateRooms = data => {
      //   this.rooms.push(data);
      //   console.log(`Rooms: ${this.rooms}`);
      // };

      this.joinRoom = id => appTalkService.joinRoom({
        id: id,
        callback: {
          successJoinRoom: data => {
            // TODO
          }
        }
      });
    }
  ]);
