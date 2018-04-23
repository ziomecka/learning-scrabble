/* jshint esversion: 6 */
class RoomService {
  constructor (
    roomSocket,
    userData,
    newroomDefaults,
    roomStates,
    userStates,
    routerLazyLoadService,
    $q,
    $injector) {
    "ngInject";

    /** Services */
    Object.assign(this, {
      roomSocket,
      userData,
      newroomDefaults,
      roomStates,
      userStates,
      routerLazyLoadService,
      $q,
      $injector
    });

    /** Room options */
    this.numberPlaces = undefined;
    this.time = this.newroomDefaults.timeOptions[3] || 10;

    /** Room data */
    this.id = undefined;
    this.owner = undefined;
    this.name = undefined;

    this.places = [];
    this.users = [];
    this.user = {
      state: undefined,
      placeId: undefined,
      login: this.userData.login,
      ownsRoom: false
    };

    /** State */
    this.state = undefined;

    /** The user may become a player */
    this.player = undefined;
    this.gameId = undefined;
  }

  get isUserOwner () {
    return this.owner === this.user.login;
  }

  initializeObserver () {
    this.routerLazyLoadService
    .load("observer")
    .then(() => {
      const scrabbleObserverSocket = this.$injector.get("scrabbleObserverSocket");

      /** Get game and proceed depending on status. */
      /** TODO game and not id */
      // scrabbleObserverSocket.getGame({
      //   roomId: this.id
      // })
      // .then(data => {
      //   this.gameId = data.id;
      //   /** If game in progress: observe game,
      //       else do nothing - because controller will allow the player to seat.
      //       TODO what does it mean: if player seats then starts to listen waitForGame.
      //       */
      //   if (this.status === this.roomStates.get("gamePlayed")) {
      //     // TODO add module
      //     this.userData.state = this.userStates.get("observesGame");
      //   } else {
      //     this.userData.state = this.userStates.get("considersPlaying");
      //   }
      //   this.observeRoomSocket = this.roomSocket.observeRoom();
      //   this.observeRoomSocket.listen();
      // });
    });
  }

  /** Create game, create player. */
  initializePlayer () {
    this.routerLazyLoadService.load("player")
    .then(() => {
      const scrabbleGameSocket = this.$injector.get("scrabbleGameSocket");

      /** Create new game and
          make the user a player.
          */
      scrabbleGameSocket.createGame({
        roomId: this.id
      })
      .then(data => {
        // TODO in the socket listen if onwers changes
        /** If the room is brand new, then on the server side:
            the user becomes an owner of a room,
            the user is placed on the first place in the room.
            */
        /** TODO game and not id */
        this.gameId = data.id;

        /** Make the user a player. */
        this.userData.state = this.userStates.get("waitsForGame");

        /** Listen to wait for game */
        this.observeWaitForPlayersSocket = this.roomSocket.observeWaitForPlayers();
        this.observeWaitForPlayersSocket.listen();
      });
    });
  }

  /** When initiated ($onInit in controller).
      Can initialise either:
      - player
      - observer
      */
  initializeRoom (roomData) {
    // let newroom; // TODO remove
    /** Get roomData (from the ui-router resolve) */
    ({
      room: {
        places: this.places,
        id: this.id, // roomsId === gamesId
        numberPlaces: this.numberPlaces,
        name: this.name,
        owner: this.owner,  // TODO on server side - if no owner, set the user the owner
        status: this.status   // TODO on server side - set statuses
      } = {},
      game: {
        id: this.gameId
      } = {}
    } = roomData);

    /** If room is new initialize player.
        else: initialize observer.
        */
    if (this.status === "new") {
      this.initializePlayer();
      this.initializeObserver();
    } else {
      /** Only observer, player initialised if seats. */
      this.initializeObserver();
    }

    /** Always: listen to room users. */
    this.observeOtherUsersSocket = this.roomSocket.observeOtherUsers();
    this.observeOtherUsersSocket.listen();
  }

  /** When destroyed ($onDestroy in controller):
      clear service data,
      stop listening to events.
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
    return this.places.findIndex((place) => place.login === this.user.login);
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

    this.initializePlayer();
    this.userData.state = this.userStates.get("waitsForGame");
    this.observeWaitForPlayers = this.roomSocket.observeWaitForPlayers();
    this.observeWaitForPlayers.listen();
  }

  assignUserToPlace (data) {
    let place = this.data.places.find(item => item.id === data.placeId);
    place.login = data.login;
    place.isOpened = false;
    this.userData.placeId = data.placeId;
    this.data.players.push(data.login);
    place = null;
  }

  getUp (data) {
    let thisData = this.data;
    let placeIndex = findPlaceIndex();
    let place = thisData.room.places[placeIndex];
    place.login = undefined;
    place.isOpened = true;
    this.userData.placeId = undefined;
    // let playerIndex = thisData.players.findIndex(thisData.player.login);
    // this.players.splice(playerIndex, 1);
    this.roomSocket.getUp({
      roomID: thisData.room.id,
      placeId: place.id,
      callbacks: {
        success: () => {}
      }
    });

    this.userData.state = this.userStates.get("considersPlaying");
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
