/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "newroomDefaults",
  "newroomService",
  "roomsService",
  function ($scope, newroomDefaults, newroomService, roomsService) {
    let me = $scope;
    me.defaults = newroomDefaults;
    me.nameUnique = true;
    me.name = "scrabble";
    me.numberPlaces = me.defaults.placesOptions[0];
    me.buttonsDisabled = false;

    me.createRoom = data => {
      newroomService.createRoom({
        data: data,
        callbacks: {
          success: data => data, // TODO not needed
          failure: () => {} //TODO
        }
      });
    };
  }
];
