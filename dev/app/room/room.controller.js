/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "scrabbleGameFactory",
  "appTalkService",
  "roomService",
  "newroomDefaults",
  "authorizationService",
  "playerFactory",
  "roomData",
  function ($scope, scrabbleGameFactory, roomService, appTalkService, newroomDefaults, authorizationService, playerFactory, roomData) {
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

    me.createGame = () => {
      /** Ask to prepare the game */
      me.scrabble = scrabbleGameFactory.prepare({
        data: {
          id: $scope.id
        }
      });

      me.scrabble.then(data => {
        console.log(`id: ${data.id}`);
        me.scrabble.id = data.id;
        me.ready = true;
      });
    };

    this.$onInit = () => {
      let game;

      ({
        room: {
          places: $scope.places,
          id: $scope.id, // roomsId === gamesId
          numberPlaces: $scope.numberPlaces,
          name: $scope.name,
        } = {},
        game: {
          id: $scope.game
        } = {} // TODO check if correctly default
      } = JSON.parse(roomData));

      me.place = me.findPlace();
      me.seated = me.doISeat();
      /** If no game in the room then create game */
      if ($scope.game === undefined || $scope.game === null) {
        me.createGame();
      }
    };

    // me.exchanging = false;
    // me.playing = false;

   //  me.clickTile = () => {
   //   if (me.exchanging)  {
   //     tile.toBeExchanged = true;
   //   } else if (me.playing) {
   //     // TODO
   //   }
   // };

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

    me.listenAskForAcceptance = () => roomService.askPlayerStart({
      callback: {
        successAskPlayerStart: () => me.askForAcceptance = true
      }
    });

    me.accept = options => {
      roomService.resAccepted({});
    };

    me.start = options => {
      options = Object(options);
      me.scrabble.start().then((data) => {
        console.log(`id: ${me.scrabble.id}`);
        me.drawTiles({number: 7});
      });
    };

    me.drawTiles = options => {
      console.log("Tiles have been drawn.");
      me.tiles = [...me.tiles, ...me.scrabble.drawTiles({number: options.number})];
    };
  }
];
