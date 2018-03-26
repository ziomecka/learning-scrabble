/* jshint esversion: 6 */

angular
.module("roomsModule")
.controller("roomsController", [
  "$scope",
  "$rootScope",
  "$location",
  "clientService",
  ($scope, $rootScope, $location, clientService) => {
  let me = $scope;
  me.rooms = [];

  clientService.emit("rooms: get all rooms' names");

  clientService.on("rooms: all rooms' names sent", data => me.rooms = [...data.rooms]);

  clientService.on("rooms: new room created", data => me.rooms.push(data));

  me.joinRoom = (id) => clientService.emit("rooms: join room", {id: id});
}]);
