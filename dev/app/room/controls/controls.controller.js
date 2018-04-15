/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "roomSocket",
  "roomService",
  "routerGoService",
  ($scope, roomSocket, roomService, routerGoService) => {
    const me = $scope;
    me.getup = () => {};
    me.start = () => {};
    me.leave = () => {
      roomSocket.leaveRoom({
        callbacks: {
          success: () => {
            routerGoService.go();
          }
        },
        roomId: roomService.data.room.id
      });
    };
  }
];
