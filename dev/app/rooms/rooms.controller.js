/* jshint esversion: 6 */
angular
.module("roomsModule")
.controller("roomsController", [
  "$scope",
  "$rootScope",
  "$location",
  "clientService",
  "clientEvents",
  ($scope, $rootScope, $location, clientService, clientEvents) => {
    let me = $scope;
    me.rooms = [];

    clientService.emit(clientEvents.reqAllRooms);

    clientService.on(clientEvents.resAllRooms, data => me.rooms = [...data.rooms]);

    clientService.on(clientEvents.resNewroom, data => me.rooms.push(data));

    me.joinRoom = (id) => clientService.emit(clientEvents.reqJoinRoom, {id: id});
  }
]);
