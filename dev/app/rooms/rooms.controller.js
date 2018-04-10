/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "roomsSocket",
  "roomsList",
  "roomsService",
  function ($scope, roomsSocket, roomsList, roomsService) {
    let me = $scope;
    me.rooms = [];
    // me.rooms = roomsService.rooms;
    // console.log(me.rooms);

    this.$onInit = () => {
      me.rooms = [...roomsList];
      roomsService.rooms = [...roomsList];
    };

    me.joinRoom = id => roomsService.joinRoom({
      id: id
      // callbacks: {
      //   successJoinRoom: data => {
      //     me.buttonsDisabled = false; //TODO not needed?
      //   }
      // }
    });

    me.updateRooms = data => {
      me.rooms.push(data);
    };

    // TODO:
    roomsSocket.createRoomSuccess(me.updateRooms);
  }
];
