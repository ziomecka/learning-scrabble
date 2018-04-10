/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "authorizationService",
  "roomSocket",
  "roomService",
  ($scope, authorizationService, roomSocket, roomService) => {
    const me = $scope;
    me.getup = () => {};
    me.start = () => {};
    me.leave = () => {
      roomSocket.leaveRoom({
        callbacks: {
          success: () => {
            authorizationService.go();
          }
        },
        roomId: roomService.data.room.id
      });
    };
  }
];
