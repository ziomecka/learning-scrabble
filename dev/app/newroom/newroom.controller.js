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
  "$stateParams",
  ($scope, $rootScope, $location, clientService, newroomDefaults,
    authorizationService, clientEvents, $stateParams) => {
    let me = $scope;
    me.defaults = newroomDefaults;
    me.nameUnique = true;
    me.name = "scrabble";
    me.numberPlaces = me.defaults.placesOptions[0];
    me.buttonsDisabled = false;

    me.changeName = () => {if (!me.nameUnique) me.nameUnique = true;};

    me.createRoom = () => {
      me.buttonsDisabled = true;
      $stateParams.numberPlaces = me.numberPlaces;
      clientService.emit(clientEvents.reqNewroom, {
        name: me.name,
        numberPlaces: me.numberPlaces,
        login: authorizationService.login
      });
    };

    clientService.on(clientEvents.resNewroomJoined, data => {
      me.buttonsDisabled = false;
      authorizationService.go({
        state: "private.room",
        roomId: data.id
      });
    });
  }
]);
