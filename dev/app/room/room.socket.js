/* jshint esversion: 6 */
class RoomSocket {
  constructor (
    socketFactory,
    roomEvents,
    // playerStates,
    // $timeout,
    // $q,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      socketFactory,
      roomEvents,
      // playerStates,
      // $timeout,
      // $q,
      userData
    });
  }

  leaveRoom(options) {
    let {callbacks: {success}} = options;
    this.socketFactory.emit(this.roomEvents.reqLeaveRoom, {
      roomId: options.roomId,
      login: this.userData.login
    });

    this.listenleaveRoom({
      callbacks: {
        success: success
      }
    });
  }

  listenLeaveRoom(options) {
    let {callbacks: {success}} = options;
    let eventName= this.roomEvents.resLeaveRoomSuccess;
    this.socketFactory.on(eventName, data => {
      success(data);
      this.socketFactory.off(eventName);
    });
  }

  /** Listen if other users joined the room. */
  listenOtherUserJoinedRoom(options) {
    let {callbacks: {success}} = options;
    let eventName = this.roomEvents.resOtherUserJoinedRoom;
    this.socketFactory.on(eventName, data => {
      success();
      // Do not stop listening as long as in the room
    });
  }

  /** Listen if other users left the room. */
  listenOtherUserLeftRoom(options) {
    let eventName = this.roomEvents.resOtherUserLeftRoom;
    this.socketFactory.on(eventName, data => {
      success();
      // Do not stop listening as long as in the room
    });
  }

  listenOtherUserTookPlace(options) {
    let {callbacks: {success}} = options;
    let eventName = this.roomEvents.resOtherUserTookPlace;
    this.socketFactory.on(eventName, data => {
      success(data);
      // Do not stop listening, unless the game is started
    });
  }

  // TODO can be listened only if more than one players
  listenOtherPlayerGotUp(options) {
    let {callbacks: {success}} = options;
    let eventName = this.roomEvents.resOtherPlayerGotUp;
    this.socketFactory.on(eventName, data => {
      success(data);
    });
  }

  listenAllPlayersStarted(options) {
    let {callbacks: {success}} = options;
    let eventName = this.roomEvents.resAllPlayersStarted;
    socektService.on(eventName, data => {
      success();
      this.socketFactory.off(eventName);
    });
  }

  //////////////////
  // GAME OPTIONS //
  //////////////////
  changeNumberPlaces(options) {
    let {roomId, number} = options;
    let eventName = this.roomEvents.reqChangeNumberPlaces;
    this.socketFactory.emit(eventName, {
      roomId: roomId,
      number: number
    });
  }

  /** Listen if number places changes. */
  listenNumberPlacesChanged(options) {
    let eventName = this.roomEvents.resChangeNumberPlacesSuccess;
    let {callbacks: {success}} = options;
    this.socketFactory.on(eventName, data => {
      success(data);
    });
  }

  changeTime(options) {
    let {roomId, number} = options;
    let eventName = this.roomEvents.reqChangeTime;
    this.socketFactory.emit(this.roomEvents.eventName, {
      roomId: roomId,
      number: number
    });
  }

  /** Listen if time changes. */
  listenTimeChanged (options) {
    // TODO success and failure
    let eventName = this.roomEvents.resChangeTimeSuccess;
    let {callbacks: {success}} = options;
    this.socketFactory.on(eventName, data => {
      success(data);
    });
  }

  /** When game started options cannot change, so stop listening. */
  stopListenOptionsChanged() {
    this.socketFactory.off(this.roomEvents.resChangeNumberPlacesSuccess);
    this.socketFactory.off(this.roomEvents.resChangeTimeSuccess);
    this.socketFactory.off(this.roomEvents.resOtherUserTookPlace);
    // TODO got up?
  }

  //////////
  // USER //
  //////////
  takePlace(options) {
    let {roomId, placeId, callbacks: {success}} = options;
    this.data.player.placeId = placeId;
    this.socketFactory.emit(this.roomEvents.reqTakePlace, {
      roomID: roomId,
      placeId: placeId,
      login: this.userData.login
    });

    this.listenTakePlace({
      callbacks: {
        success: success
      }
    });
  }

  listenTakePlace(options) {
    let {callbacks: {success}} = options;
    let eventName = this.roomEvents.resTakePlaceSuccess;
    this.socketFactory.on(eventName, data => {
      success(data);
      this.listenAskForStart({
        callbacks: {
          success: () => {
            this.listenAllPlayersStarted();
          }
        }
      });
      this.socketFactory.off(eventName);
    });
  }

  getUp(options) {
    let {roomId, placeId, callbacks: {success}} = options;
    this.socketFactory.emit(this.roomEvents.reqGetUp, {
      roomID: roomId,
      placeId: placeId,
      login: this.userData.login
    });
    this.listenGetUp({
      callbacks: {
        success: success
      }
    });
  }

  listenGetUp(options) {
    let eventName = this.roomEvents.resGetUp;
    this.socketFactory.on(eventName, data => {
      this.data.player.placeId = undefined;
      success(data);
      this.socketFactory.off(eventName);
    });
  }

  listenAskForStart(options) {
    let {callbacks: {success}} = options;
    let eventName = this.roomEvents.resAskPlayerStart;
    this.socketFactory.on(eventName, data => {
      success();
      this.socketFactory.off(eventName);
    });
  }

  // all players started - create game factory
  listenNotStarted(options) {
    let {callbacks: {success}} = options;
    let eventName = this.roomEvents.resNotStarted;
    this.socketFactory.on(eventName, data => {
      this.socketFactory.off(this.roomEvents.resAllPlayersStarted);
      /** If user seats then listen to askForStart */
      if (this.data.player.placeId) {
        this.listenAskForStart({
          callbacks: {
            success: () => {
              this.listenAllPlayersStarted();
            }
          }
        });
      }
      success();
      this.socketFactory.off(eventName);
    });
  }

  start(options) {
    // TODO emit started

  }

  listenGameStarted (options) {

  }

  ////////////////
  // AGGREGATED //
  ////////////////
  observeOtherUsers() {
    const listen = () => {
      this.listenOtherUserJoinedRoom(
        {
          callbacks: {
            success: data => {
              this.data.room.users.push({"login": data.login});
              console.log(`User ${data.login} joined the room`);
            }
          }
        }
      );

      /** Listen if other users left the room. */
      this.listenOtherUserLeftRoom(
        {
          callbacks: {
            success: data => {
              let users = this.data.room.users;
              users.splice(users.indexOf(data.login), 1);
              console.log(`User ${data.login} left the room`);
              users = "";
            }
          }
        }
      );
    };

    const stopListen = () => {
    };

    return {
      listen: listen,
      stopListen: stopListen
    };
  }

  observeWaitForPlayers() {
    const listen = () => {
      /** Listen if other users take places */
      this.listenOtherUserTookPlace(
        {
          callbacks: {
            success: data => {
              this.data.game.players.push({"login": data.login});
              this.data.room.places[data.placeId].
              console.log(`User ${data.login} took place ${data.placeId}`);
              // TODO
              // this.listenOtherUserGotUp
              // TODO set place's owner
            }
          }
        }
      );

      /** Listen if other players get up */
      this.listenOtherPlayerGotUp(
        {
          callbacks: {
            success: data => {
              // TODO remove player
              if (this.data.game.players.length <= 1) {
                // TODO
                // this.stopListenOtherUserGotUp
              }
            }
          }
        }
      );

      /** Listen for changes in number of places */
      this.listenNumberPlacesChanged({
        callbacks: {
          success: data => {
            let places = this.data.room.places;
            if (data.action === "added") {
              this.data.room.places = [...places, ...data.places];
            } else if (data.action === "removed") {
              this.data.room.places = lodashFactory.differenceWith(places, data.places, (arrVal, othVal) => {
                return arrVal.id === othVal.id;
              });
            }
            places = null;
          }
        }
      });

      /** Listen for changes in game's */
      this.listenTimeChanged(
        {
          callbacks: {
            success: data => {
              this.data.room.time = data.time;
            }
          }
        }
      );
    };

    const stopListen = () => {
    };

    return {
      listen: listen,
      stopListen: stopListen
    };
  }


  playGame() {
    const listen = () => {
      this.listenPlayerLost();
      this.listenPlayerGetBack();
    };

    const stopListen = () => {
    };

    return {
      listen: listen,
      stopListen: stopListen
    };
  }

  observeGame() {
  }
}

angular
  .module("roomModule")
  .service("roomSocket", RoomSocket);
