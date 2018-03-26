/* jshint esversion: 6 */

angular
.module("newroomModule")
.controller("newroomController", [
  "$scope",
  "$rootScope",
  "$location",
  "clientService",
  "newroomDefaults",
  "authorizationService",
  "clientEvents",
  ($scope, $rootScope, $location, clientService, newroomDefaults, authorizationService, clienrEvents) => {
    let me = $scope;
    me.defaults = newroomDefaults;
    me.nameUnique = true;
    me.newRoom = {
      name: "scrabble",
      // TODO
      owner: {
        id: clientService.id,
        name: "player"
      },
      numberPlaces: me.defaults.placesOptions[0],
      time: me.defaults.timeOptions[0]
    };

    me.changeName = () => {if (!me.nameUnique) me.nameUnique = true;};

    me.createRoom = () => {
      clientService.emit(clientEvents.reqNewroom, me.newRoom);
    };

    clientService.on(clientEvents.resNewroomJoined, data => {
      authorizationService.go({state: "private.room", roomId: data.id});
    });
  }
]);
