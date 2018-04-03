/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "scrabbleService",
  "appService",
  "newroomDefaults",
  "authorizationService",
  function ($scope, scrabbleService, appService, newroomDefaults, authorizationService) {
    let me = $scope;
    me.defaults = newroomDefaults;
    me.time = newroomDefaults.timeOptions[3] || 10;
    me.places = [];
    me.players = [];
    me.login = authorizationService.login; // TODO needed?
    me.placeId = "";
    me.seated = false;

    // this.$onInit = () => {
    //   ({
    //     places: $scope.places,
    //     id: $scope.id,
    //     numberPlaces: $scope.numberPlaces,
    //     name: $scope.name
    //   } = JSON.parse(this.roomData));
    //   me.place = me.findPlace();
    //   me.seated = me.doISeat();
    // };

    me.findPlace = () => me.places.findIndex((place) => place.login === me.login);

    me.doISeat = () => me.place >= 0;

    me.numberPlacesChanged = number => {
      appService.changeNumberPlaces({
        id: me.id,
        number: number,
        callback: {
          successIncreased: data => me.places = [...me.places, ...data.places],
        }
      });
    };

    me.takePlace = data => {
      appService.takePlace({
        roomID: me.id,
        placeId: data.placeId,
        callback: {
          successTakePlace: data => {
            let place = me.places.find(item => item.id === data.placeId);
            place.owner.login = data.login;
            place.isOpened = false;
            me.seated = true;
            me.players.push(data.login);
            me.askForAcceptance = false;
            place = null;
          },
        }
      });
    };

    me.getUp = () => {
      place.owner.login = undefined;
      place.name = "...";
      place.isOpened = true;
      me.seated = false;
      me.players.splice(me.players.findIndex(me.login), 1);
      appService.getUp({
        roomID: me.id,
        placeId: me.place,
        callback: {
          successGetUp: () => {}
        }
      });
    };

    me.listenToStart = (() => appService.askPlayerStart({
      callback: {
        successAskPlayerStart: () => me.askForAcceptance = true
      }
    }))();

    me.listenToCreateScrabble = (() => scrabbleService.createScrabble({
      callback: {
        successCreateScrabble: () => {} //TODO
      }
    }))();
  }
];
