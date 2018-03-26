/* jshint esversion: 6 */

angular
.module("newroomModule")
.controller("newroomController", [
  "$scope",
  "$rootScope",
  "$location",
  "clientService",
  // "scrabbleDefaults",
  "authorizationService",
  ($scope, $rootScope, $location, clientService, authorizationService) => {
  let me = $scope;

  // me.defaults = scrabbleDefaults;
  me.nameUnique = true;
  me.newRoom = {
    name: "scrabble",
    owner: {
      id: clientService.id,
      name: "player"
    },
    // numberPlaces: me.defaults.placesOptions[0],
    // time: me.defaults.timeOptions[0]
  };

  me.changeName = () => {if (!me.nameUnique) me.nameUnique = true;};

  me.createRoom = () => {
    console.log("dataownerid" + me.newRoom.owner.id);
    clientService.emit("rooms: create new room", me.newRoom);
  };

  clientService.on("rooms: room joined", data => {
    authorizationService.go({state: "private.room", roomId: data.id});
    // authorizationService.go(`/rooms.${data.id}`);
  });
  // $location.path(`/room${data.id}`)
}]);
