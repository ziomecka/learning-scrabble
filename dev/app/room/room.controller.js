/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "scrabbleGameFactory",
  "appTalkService",
  "roomService",
  "newroomDefaults",
  "authorizationService",
  "playerFactory",
  function ($scope, scrabbleGameFactory, roomService, appTalkService, newroomDefaults, authorizationService, playerFactory) {
    let me = $scope;
    me.player = null;
    me.tiles = null;
    me.defaults = newroomDefaults;
    me.time = newroomDefaults.timeOptions[3] || 10;
    me.places = [];
    me.players = [];
    me.login = authorizationService.login; // TODO needed?
    me.placeId = "";
    me.seated = false;


    me.scrabble = scrabbleGameFactory;
    /** ask server to prepare data */
    me.scrabble.id = me.scrabble.prepare(); // TODO promise?

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

    me.exchanging = false;
    me.playing = false;

    me.clickTile = () => {
     if (me.exchanging)  {
       tile.toBeExchanged = true;
     } else if (me.playing) {
       // TODO
     }
   };

    // me.exchangeTiles = scrabblePlayer.exchangeTiles();
    // me.endRound = scrabblePlayer.endRound();
    // me.verifyWord = scrabblePlayer.verifyWord();

    me.findPlace = () => me.places.findIndex((place) => place.login === me.login);

    me.doISeat = () => me.place >= 0;

    me.numberPlacesChanged = number => {
      roomService.changeNumberPlaces({
        id: me.id,
        number: number,
        callback: {
          successChanged: data => me.places = [...me.places, ...data.places],
        }
      });
    };

    me.takePlace = data => {
      roomService.takePlace({
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
      roomService.getUp({
        roomID: me.id,
        placeId: me.place,
        callback: {
          successGetUp: () => {}
        }
      });
    };

    me.listenToStart = () => roomService.listenToStart({
      callbacks: {
        start: data => me.start(data)
      }
    });

    me.listenAskForAcceptance = () => roomService.askPlayerStart({
      callback: {
        successAskPlayerStart: () => me.askForAcceptance = true
      }
    });

    me.accept = options => {
      roomService.resAccepted({});
    };

    me.start = options => {
      let {tiles} = options;
      me.scrabble.start({tiles: tiles});
    };


  }
];
