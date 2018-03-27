/* jshint esversion: 6 */

angular
.module("roomModule")
.controller("roomController", [
  "$scope",
  "$rootScope",
  "clientService",
  "newroomDefaults",
  "authorizationService",
  "clientEvents",
    function ($scope, $rootScope, clientService, newroomDefaults, authorizationService, clientEvents) {
      let me = $scope;
      me.defaults = newroomDefaults;
      me.time = newroomDefaults.timeOptions[3] || 10;
      me.places = [];
      me.players = [];
      me.login = authorizationService.login;

      this.$onInit = () => {
        ({places: $scope.places, id: $scope.id, numberPlaces: $scope.numberPlaces} = JSON.parse(this.roomData));
        clientService.emit(clientEvents.reqCreateScrabble);
      };

      clientService.on(clientEvents.resCreateScrabbleSuccess, data => {
        console.log(`I have been informed about creating game with id: ${data.id}.`);
      });

      me.seated = (() => me.places.some((place) => place.login === me.login))();

      me.numberPlacesChanged = num => {
        clientService.emit(clientEvents.reqNumberPlacesChanged, {
          id: me.id,
          number: num
        });
      };

      clientService.on(clientEvents.resPlacesAdded, data => {
        me.places = [...me.places, ...data.places];
        console.log("New places created");
      });

      me.takePlace = data => {
        console.log("I try to take place");
        clientService.emit(clientEvents.reqTakePlace, {
          roomID: me.id,
          placeID: data.placeID,
          login: me.login
        });
      };

      clientService.on("room: player took place", data => {
          console.log("I took place");
          let place = me.places.find(item => item.id === data.placeID);
          // place.owner.id = data.ownerID;
          // place.owner.name = data.ownerName;
          // place.name = data.ownerName;
          place.reserved = false;
          place.isOpened = false;
          me.seated = true;
          me.players.push(data.login);
          place = null;
      });
  }
]);
