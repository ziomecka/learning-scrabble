/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "appService",
  "newroomDefaults",
  "authorizationService",
  "authorizationStates",
  ($scope, appService, newroomDefaults, authorizationService, authorizationStates) => {
    let me = $scope;
    me.defaults = newroomDefaults;
    me.nameUnique = true;
    me.name = "scrabble";
    me.numberPlaces = me.defaults.placesOptions[0];
    me.buttonsDisabled = false;

    me.changeName = () => {
      if (!me.nameUnique) {
        me.nameUnique = true;
      }
    };

    me.createRoom = () => {
      appService.createRoom({
        name: me.name,
        numberPlaces: me.numberPlaces,
        callback: {
          successCreateRoom: data => {
            authorizationService.go({
              state: authorizationStates.room,
              roomId: data.roomId
            });
          }
        }
      });
      me.buttonsDisabled = true;
    };
  }
];
