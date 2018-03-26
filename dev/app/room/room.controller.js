/* jshint esversion: 6 */

angular
.module("roomModule")
.controller("roomController", [
  "$scope",
  "$rootScope",
  "clientService",
  ($scope, $rootScope, clientService) => {
    let me = $scope;
    me.places = [];
    me.players = [];
    me.seated = true;
    me.joinName = "Joe Doe";

    me.numberOfPlaces = () => me.places.length;

    clientService.on("rooms: details of joined room sent", data => {

      ({id: me.id, places: me.places} = JSON.parse(data));

      me.optionsNumber = me.numberOfPlaces();
      me.seated = (() => me.places.some((place) => place.owner.id === clientService.id))();

      me.numberPlacesChanged = () => clientService.emit("room: number of places changed", {id: me.id, number: me.optionsNumber});

      clientService.on("room: new places", data => {
        me.places = [...me.places, ...data.places];
        console.log("New places created");
      });

    });

    $scope.$watch("places", newValue => console.log(newValue), true);

    me.takePlace = data => {
      console.log("I try to take place");
      clientService.emit("room: take place", {playerID: data.playerID, playerName: data.joinName, roomID: me.id, placeID: data.placeID});
    };

    clientService.on("room: player took place", data => {
        console.log("I took place");
        let place = me.places.find(item => item.id === data.placeID);
        place.owner.id = data.ownerID;
        place.owner.name = data.ownerName;
        place.name = data.ownerName;
        place.reserved = false;
        place.isOpened = false;
        me.seated = true;
        me.players.push(data.ownerID);
        place = null;
    });
  }
]);
