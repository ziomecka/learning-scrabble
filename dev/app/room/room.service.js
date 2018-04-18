/* jshint esversion: 6 */
class RoomService {
  constructor (
    roomSocket, newgameService, userData,
    newroomDefaults, lodashFactory, roomStates,
    scrabbleGameFactory, userStates) {
      "ngInject";
      this.roomSocket = roomSocket;
      this.newgameService = newgameService;
      this.userData = userData;
      this.defaults = newroomDefaults;
      // this.lodashFactory = lodashFactory;
      this.roomStates = roomStates;
      this.scrabbleGameFactory = scrabbleGameFactory;
      this.userStates = userStates;

      /** Initialize data */
      // TODO change
      this.clearData();
    }

    clearData() {
      /** Data shared with controller. */
      this.data = {
        user: {
          state: undefined,
          placeId: undefined,
          login: this.userData.login,
          ownsRoom: false
        },
        // player: this.scrabbleGameFactory.player,
        room: {
          id: undefined,
          places: [],
          users: [],
          numberPlaces: undefined,
          time: this.defaults.timeOptions[3] || 10,
          state: this.roomStates.waitingForPlayers // TODO
        },
        game: {
          id: undefined
        }
      };
    }

    /** When initiated ($onInit in controller) */
    initializeRoom (roomData) {
      console.log("roomData: " + JSON.stringify(roomData));
      let room = this.data.room;
      let game = this.data.game;
      // let player = this.data.player;
      let newroom = false;

      /** Get roomData (from the ui-router resolve) */
      ({
        newroom,
        room: {
          places: room.places,
          id: room.id, // roomsId === gamesId
          numberPlaces: room.numberPlaces,
          name: room.name,
          owner: room.owner   // TODO on server side - if no owner, set the user the owner
        } = {}, // TODO check if I set defaults correctly
        game: {
          id: game.id
        } = {} // TODO check if I set defaults correctly
      } = roomData);

      /** If newly created room find place on which user seats, create game,
      listen to waitForGame.
      */
      if (newroom && (game.id === undefined || game.id === null)) {
        /** Find place with my login */
        // player.place = findPlaceIndex();

        /** In case of creating a new room server:
        - makes the user an owner of a room
        - places the user on the first place in the room
        */
        // TODO in the socket listen if onwers changes
        // this.data.player.state = this.userStates.get("waitsForGame");

        /** Listen to wait for game */
        this.observeWaitForPlayers = this.roomSocket.observeWaitForPlayers();
        this.observeWaitForPlayers.listen();

        /** Check if I own the room TODO not needed */
        // this.data.player.ownsRoom = (room.owner === userData.login);

        /** Create new game */
        this.newgameService
        .createGame({
          roomId: room.id
        })
        .then(data => {
          /** TODO game  and not id */
          this.data.game.id = data.id;
        });
      }
      /** Else:
      - get game data
      - if game in progress: observe game
      - else do nothing - because controller will allow the player to seat
      if player seats then starts to listen waitForGame */
      else {
        /** Get game */
        this.newgameService
        .getGame({
          roomId: room.id
        })
        .then(data => {
          /** TODO game  and not id */
          this.data.game.id = data.id;
          if (this.room.status === this.roomStates.get("gamePlayed")) {
            // this.data.player.state = this.userStates.get("observesGame");
            this.observeGameSocket = this.roomSocket.observeGame();
            this.observeGameSocket.listen();
          } else {
            // this.data.player.state = this.userStates.get("considersPlaying");
            this.observeRoomSocket = this.roomSocket.observeRoom();
            this.observeRoomSocket.listen();
          }
        });
      }

      /** Listen to room users. */
      this.observeOtherUsersSocket = this.roomSocket.observeOtherUsers();
      this.observeOtherUsersSocket.listen();

      /** Collect garbage */
      room = null;
      game = null;
      // player = null;
    }

    /** When destroyed ($onDestroy in controller):
    - clear service data,
    - stop listening to events.
    */
    destroyRoom (roomData) {
      clearData(); // TODO is needed? is the service destroyed and when?
      [
        this.observeOtherUsersSocket,
        this.observeWaitForPlayersSocket,
        this.playGameSocket,
        this.observeGameSocket
      ].forEach(socket => {
        socket.stopListen();
        socket = null;
      });
    }

    findPlaceIndex () {
      // return this.data.room.places.findIndex((place) => place.login === this.data.player.login);
    }

    /////////////
    // OPTIONS //
    /////////////
    numberPlacesChanged (number) {
      this.roomSocket.changeNumberPlaces({
        roomId: this.data.room.id,
        number: number
      });
    }

    timeChanged (time) {
      this.roomSocket.changeTime({
        roomId: this.data.room.id,
        time: time
      });
    }

    ////////////
    // PLACES //
    ////////////
    takePlace (data) {
      this.roomSocket.takePlace({
        roomID: this.data.room.id,
        placeId: data.placeId,
        login: this.userData.login,
        callbacks: {
          successTakePlace: data => {
            this.assignUserToPlace(data);
          },
        }
      });

      // this.data.player.state = this.userStates.get("waitsForGame");
      this.observeWaitForPlayers = this.roomSocket.observeWaitForPlayers();
      this.observeWaitForPlayers.listen();
    }

    assignUserToPlace (data) {
      let place = this.data.places.find(item => item.id === data.placeId);
      place.login = data.login;
      place.isOpened = false;
      // this.data.player.placeId = data.placeId;
      this.data.players.push(data.login);
      place = null;
    }

    getUp (data) {
      let thisData = this.data;
      let placeIndex = findPlaceIndex();
      let place = thisData.room.places[placeIndex];
      place.login = undefined;
      place.isOpened = true;
      // thisData.player.placeId = undefined;
      // let playerIndex = thisData.players.findIndex(thisData.player.login);
      // this.players.splice(playerIndex, 1);
      this.roomSocket.getUp({
        roomID: thisData.room.id,
        placeId: place.id,
        callbacks: {
          success: () => {}
        }
      });

      // this.data.player.state = this.userStates.get("considersPlaying");
      this.observeWaitForPlayers.stopListen();
      this.observeWaitForPlayers = null;
      /** Collect garbage */
      thisData = null;
      place = null;
    }
}

angular
  .module("roomModule")
  .service("roomService", RoomService);
