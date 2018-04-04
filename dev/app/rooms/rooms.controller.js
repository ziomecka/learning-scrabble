/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "appTalkService",
  "roomsList",
  function ($scope, appTalkService, roomsList) {
    let me = $scope;
    me.rooms = [];

    this.$onInit = () => {
      me.rooms = [...roomsList];
    };

    appTalkService.newRoomAdded({
      callback: {
        successNewRoomAdded: data => me.rooms = [...me.rooms, ...data] // TODO
      }
    });

    me.joinRoom = id => appTalkService.joinRoom({
      id: id,
      callback: {
        successJoinRoom: data => {
          me.buttonsDisabled = false; //TODO not needed?
        }
      }
    });
  }
];
