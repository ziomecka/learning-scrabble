/* jshint esversion: 6 */
class RoomService {
  constructor (
    userData,
    socketFactory,
    roomUsersService,
    roomPlayersService,
    roomOptionsService,
    // roomObserverService,
    roomGameService,
    roomStates,
    roomEvents,
    $stateParams,
    roomsService,
    coreToggleStatesService
  ) {
    "ngInject";

    /** Services */
    Object.assign(this, {
      userData,
      socketFactory,
      roomUsersService,
      roomPlayersService,
      roomOptionsService,
      // roomObserverService,
      roomGameService,
      roomStates,
      roomEvents,
      $stateParams,
      roomsService,
      coreToggleStatesService
    });

    /** Room data */
    this.id = undefined;
    this._owner = undefined;
    this.name = undefined;
    this.gameId = undefined;

    this._activeSockets = [];
    this._game = {};

    /** State */
    this._state;
    this.statesServices = {
      "waitingForPlayers": [
        "roomUsersService",
        "roomPlayersService",
        "roomOptionsService",
        "roomGameService"
      ],
      "waitingForStart": [
        "roomUsersService",
        "roomPlayersService",
        "roomGameService"
      ],
      // "waitingForOtherPlayersStart": [
      //   "roomUsersService",
      //   "roomPlayersService"
      // ],
      "closed": [
        "roomUsersService",
        "roomObserverService"
      ],
      "playing": [
        "roomUsersService",
        "roomGameService"
      ]
    };

    this.listens = [
      {
        name: this.roomEvents.resRoomStateChanged,
        callback: function (data) {
          this.state = data.state;
        }.bind(this)
      }
    ];

    // let collection = $stateParams.collection;
    // this.gameModule = {
    //   "service": `${collection}Service`,
    //   "controller": `${collection}Service`,
    //   "board": `${collection}Service`,
    //   "sidebar": `${  collection}Service,`
    // }
  }

  get collection () {
    return this._collection;
  }

  set collection (collection) {
    this._collection = collection;
  }

  get isWaitingForPlayers () {
    return this.state === this.roomStates.get("waitingForPlayers");
  }

  get isWaitingForStart () {
    return this.state === this.roomStates.get("waitingForStart");
  }

  get isWaitingForOtherPlayersStart () {
    return this.state === this.roomStates.get("waitingForOtherPlayersStart");
  }

  get userCanGetUp () {
    return (this.isWaitingForPlayers || this.isWaitingForStart) && (this.roomPlayersService.seated >= 0);
  }

  get userCanStart () {
    return (
      (this.isWaitingForStart || this.isWaitingForOtherPlayersStart) &&
      (this.roomPlayersService.seated >= 0)
    );
  }

  get userCanLeave () {
    return this.roomPlayersService.seated === -1;
  }

  get userCanChangeOptions () {
    return this.isWaitingForPlayers && this.userOwnsRoom;
  }

  // TODO
  get userIsPlayer () {
    return this.userData.gameId === this.gameId;
  }

  //
  // get isWaitingForOtherPlayersStart () {
  //   return this.state === this.roomStates.get("waitingForOtherPlayersStart");
  // }
  //
  get isPlaying () {
    return this.state === this.roomStates.get("playing");
  }
  //
  // get isClosed () {
  //   return this.state === this.roomStates.get("closed");
  // }

  get owner () {
    return this._owner;
  }

  set owner(login) {
    this._owner = login;
  }

  get places () {
    return this.roomPlayersService.places;
  }

  set places (places) {
    this.roomPlayersService.places = places;
  }

  get state () {
    return this._state;
  }

  set state (state) {
    this.toggleStateSockets(state);
    this._state = state;
    console.log("Room state has been changed to: " + state);
  }

  get activeSocket () {
    return undefined; // TODO
  }

  set activeSocket (socket) {
    this._activeSockets.push(socket);
  }

  get activeSockets () {
    return this._activeSockets;
  }

  set activeSockets (arr) {
    this._activeSockets = arr;
  }

  get game () {
    return this._game;
  }

  /** Turns on anf off listeners needed in current state. */
  toggleStateSockets (state) {
    this._activeSockets = this.coreToggleStatesService.toggleStateSockets({
      "statesServices": this.statesServices,
      "stateSockets": this.statesServices[state].map(socketName => this[socketName]),
      "state": state,
      "activeSockets": this.activeSockets
    });
  }

  dectivateAllSockets () {
    this.activeSockets.forEach(socket => {
      socket.stopListen();
    });
    this.activeSockets = [];
  }

  get userOwnsRoom () {
    return this.owner === this.userData.login;
  }

  /** When initiated ($onInit in controller). */
  initializeRoom (options) {
    /** Get roomData (from the ui-router resolve). */
    ({collection: this.collection} = options);
    this.roomsService.getRoomDetails({
      "roomId": this.$stateParams.roomId,
      "success": data => {
        // console.log("data: " + data);
        data = JSON.parse(data);
        ({
          _id: this.id, // roomsId === gamesId
          name: this.name,
          owner: this.owner,  // TODO on server side - if no owner, set the user the owner
          state: this.state,   // TODO on server side - set statees
          places: this.places,
          time: this.roomOptionsService.time,
          game: {
            board: this._game.board,
            bag: this._game.bag
          }
        } = data);

        /** Pass game data to game service. */
        this.roomGameService.game = data.game;
      },
      "failure": () => {
        // TODO
      }
    });

    /** Turn on respective socket listeners (depending on room's state). */
    this.listen();
  }

  /** When destroyed ($onDestroy in controller):
      clear service data,
      stop listening to events.
      */
  destroyRoom () {
    this.clearAllServices();
    this.dectivateAllSockets();
    this.stopListen();
  }

  clearAllServices () {
    this.clear();
    this.roomUsersService.clear();
    this.roomPlayersService.clear();
    this.roomGameService.clear();
  }

  clear () {
    this.id = undefined;
    this.owner = undefined;
    this.name = undefined;
    this.gameId = undefined;
    this._activeSockets = [];
    this._state = undefined;
  }

  listen () {
    this.socketFactory.listen(this.listens);
  }

  stopListen () {
    this.socketFactory.stopListen(this.listens);
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomService", RoomService);
