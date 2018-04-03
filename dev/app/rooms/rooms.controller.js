/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "appService",
  "roomsList",
  function ($scope, appService, roomsList) {
    let me = $scope;
    me.rooms = [];

    this.$onInit = () => {
      me.rooms = [...roomsList];
    };

    appService.newRoomAdded({
      callback: {
        successNewRoomAdded: data => me.rooms = [...me.rooms, ...data] // TODO
      }
    });

    me.joinRoom = id => appService.joinRoom({
      id: id,
      callback: {
        successJoinRoom: data => {
          me.buttonsDisabled = false; //TODO not needed?
        }
      }
    });
  }
];
