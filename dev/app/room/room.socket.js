/* jshint esversion: 6 */
class RoomSocket {
  constructor (socketService, roomEvents, playerStates, $timeout, $q, userData) {
    "ngInject";
  }

  leaveRoom(options) {
    let {callbacks: {success}} = options;
    socketService.emit(roomEvents.reqLeaveRoom, {
      roomId: options.roomId,
      login: userData.login
    });

    this.listenleaveRoom({
      callbacks: {
        success: success
      }
    });
  }

  listenLeaveRoom(options) {
    let {callbacks: {success}} = options;
    let eventName= roomEvents.resLeaveRoomSuccess;
    socketService.on(eventName, data => {
      success(data);
      socketService.off(eventName);
    });
  }

  /** Listen if other users joined the room. */
  listenOtherUserJoinedRoom(options) {
    let {callbacks: {success}} = options;
    let eventName = roomEvents.resOtherUserJoinedRoom;
    socketService.on(eventName, data => {
      success();
      // Do not stop listening as long as in the room
    });
  }

  /** Listen if other users left the room. */
  listenOtherUserLeftRoom(options) {
    let eventName = roomEvents.resOtherUserLeftRoom;
    socketService.on(eventName, data => {
      success();
      // Do not stop listening as long as in the room
    });
  }

  listenOtherUserTookPlace(options) {
    let {callbacks: {success}} = options;
    let eventName = roomEvents.resOtherUserTookPlace;
    socketService.on(eventName, data => {
      success(data);
      // Do not stop listening, unless the game is started
    });
  }

  // TODO can be listened only if more than one players
  listenOtherPlayerGotUp(options) {
    let {callbacks: {success}} = options;
    let eventName = roomEvents.resOtherPlayerGotUp;
    socketService.on(eventName, data => {
      success(data);
    });
  }

  listenAllPlayersStarted(options) {
    let {callbacks: {success}} = options;
    let eventName = roomEvents.resAllPlayersStarted;
    socektService.on(eventName, data => {
      success();
      socketService.off(eventName);
    });
  }

  //////////////////
  // GAME OPTIONS //
  //////////////////
  changeNumberPlaces(options) {
    let {roomId, number} = options;
    let eventName = roomEvents.reqChangeNumberPlaces;
    socketService.emit(eventName, {
      roomId: roomId,
      number: number
    });
  }

  /** Listen if number places changes. */
  listenNumberPlacesChanged(options) {
    let eventName = roomEvents.resChangeNumberPlacesSuccess;
    let {callbacks: {success}} = options;
    socketService.on(eventName, data => {
      success(data);
    });
  }

  changeTime(options) {
    let {roomId, number} = options;
    let eventName = roomEvents.reqChangeTime;
    socketService.emit(roomEvents.eventName, {
      roomId: roomId,
      number: number
    });
  }

  /** Listen if time changes. */
  listenTimeChanged (options) {
    // TODO success and failure
    let eventName = roomEvents.resChangeTimeSuccess;
    let {callbacks: {success}} = options;
    socketService.on(eventName, data => {
      success(data);
    });
  }

  /** When game started options cannot change, so stop listening. */
  stopListenOptionsChanged() {
    socketService.off(roomEvents.resChangeNumberPlacesSuccess);
    socketService.off(roomEvents.resChangeTimeSuccess);
    socketService.off(roomEvents.resOtherUserTookPlace);
    // TODO got up?
  }

  //////////
  // USER //
  //////////
  takePlace(options) {
    let {roomId, placeId, callbacks: {success}} = options;
    this.data.player.placeId = placeId;
    socketService.emit(roomEvents.reqTakePlace, {
      roomID: roomId,
      placeId: placeId,
      login: userData.login
    });

    this.listenTakePlace({
      callbacks: {
        success: success
      }
    });
  }

  listenTakePlace(options) {
    let {callbacks: {success}} = options;
    let eventName = roomEvents.resTakePlaceSuccess;
    socketService.on(eventName, data => {
      success(data);
      this.listenAskForStart({
        callbacks: {
          success: () => {
            this.listenAllPlayersStarted();
          }
        }
      });
      socketService.off(eventName);
    });
  }

  getUp(options) {
    let {roomId, placeId, callbacks: {success}} = options;
    socketService.emit(roomEvents.reqGetUp, {
      roomID: roomId,
      placeId: placeId,
      login: userData.login
    });
    this.listenGetUp({
      callbacks: {
        success: success
      }
    });
  }

  listenGetUp(options) {
    let eventName = roomEvents.resGetUp;
    socketService.on(eventName, data => {
      this.data.player.placeId = undefined;
      success(data);
      socketService.off(eventName);
    });
  }

  listenAskForStart(options) {
    let {callbacks: {success}} = options;
    let eventName = roomEvents.resAskPlayerStart;
    socketService.on(eventName, data => {
      success();
      socketService.off(eventName);
    });
  }

  // all players started - create game factory
  listenNotStarted(options) {
    let {callbacks: {success}} = options;
    let eventName = roomEvents.resNotStarted;
    socketService.on(eventName, data => {
      socketService.off(roomEvents.resAllPlayersStarted);
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
      socketService.off(eventName);
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
              // roomSocket.listenOtherUserGotUp
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
                // roomSocket.stopListenOtherUserGotUp
              }
            }
          }
        }
      );

      /** Listen for changes in number of places */
      roomSocket.listenNumberPlacesChanged({
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
      roomSocket.listenTimeChanged(
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
      roomSocket.listenPlayerLost();
      roomSocket.listenPlayerGetBack();
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
  .service("roomSocket", roomSocket);
