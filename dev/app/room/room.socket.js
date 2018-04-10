/* jshint esversion: 6 */
angular
  .module("roomModule")
  .service("roomSocket", [
    "socketService",
    "roomEvents",
    "playerStates",
    "$timeout",
    "$q",
    "authorizationService",
    function (socketService, roomEvents, playerStates, $timeout, $q, authorizationService) {

      //////////////////
      // ROOM DETAILS //
      //////////////////
      this.getRoomDetails = options => {
        let {callbacks: {success}} = options;
        socketService.emit(roomEvents.reqJoinedRoomDetails, {
          roomId: options.roomId,
          login: authorizationService.login
        });

        this.listenGetRoomDetails({
          callbacks: {
            success: success
          }
        });
      };

      this.listenGetRoomDetails = options => {
        let {callbacks: {success}} = options;
        let eventName= roomEvents.resJoinedRoomDetails;
        socketService.on(eventName, data => {
          success(data);
          socketService.off(eventName);
        });
      };

      ////////////////
      // LEAVE ROOM //
      ////////////////
      this.leaveRoom = options => {
        let {callbacks: {success}} = options;
        socketService.emit(roomEvents.reqLeaveRoom, {
          roomId: options.roomId,
          login: authorizationService.login
        });

        this.listenleaveRoom({
          callbacks: {
            success: success
          }
        });
      };

      this.listenLeaveRoom = options => {
        let {callbacks: {success}} = options;
        let eventName= roomEvents.resLeaveRoomSuccess;
        socketService.on(eventName, data => {
          success(data);
          socketService.off(eventName);
        });
      };

      /////////////////
      // OTHER USERS //
      /////////////////
      /** Listen if other users joined the room. */
      this.listenOtherUserJoinedRoom = options => {
        let {callbacks: {success}} = options;
        let eventName = roomEvents.resOtherUserJoinedRoom;
        socketService.on(eventName, data => {
          success();
          // Do not stop listening as long as in the room
        });
      };

      /** Listen if other users left the room. */
      this.listenOtherUserLeftRoom = options => {
        let eventName = roomEvents.resOtherUserLeftRoom;
        socketService.on(eventName, data => {
          success();
          // Do not stop listening as long as in the room
        });
      };

      this.listenOtherUserTookPlace = options => {
        let {callbacks: {success}} = options;
        let eventName = roomEvents.resOtherUserTookPlace;
        socketService.on(eventName, data => {
          success(data);
          // Do not stop listening, unless the game is started
        });
      };

      // TODO can be listened only if more than one players
      this.listenOtherPlayerGotUp = options => {
        let {callbacks: {success}} = options;
        let eventName = roomEvents.resOtherPlayerGotUp;
        socketService.on(eventName, data => {
          success(data);
        });
      };

      this.listenAllPlayersStarted = options => {
        let {callbacks: {success}} = options;
        let eventName = roomEvents.resAllPlayersStarted;
        socektService.on(eventName, data => {
          success();
          socketService.off(eventName);
        });
      };

      //////////////////
      // GAME OPTIONS //
      //////////////////
      this.changeNumberPlaces = options => {
        let {roomId, number} = options;
        let eventName = roomEvents.reqChangeNumberPlaces;
        socketService.emit(eventName, {
          roomId: roomId,
          number: number
        });
      };

      /** Listen if number places changes. */
      this.listenNumberPlacesChanged = options => {
        let eventName = roomEvents.resChangeNumberPlacesSuccess;
        let {callbacks: {success}} = options;
        socketService.on(eventName, data => {
          success(data);
        });
      };

      this.changeTime = options => {
        let {roomId, number} = options;
        let eventName = roomEvents.reqChangeTime;
        socketService.emit(roomEvents.eventName, {
          roomId: roomId,
          number: number
        });
      };

      /** Listen if time changes. */
      this.listenTimeChanged = options => {
        // TODO success and failure
        let eventName = roomEvents.resChangeTimeSuccess;
        let {callbacks: {success}} = options;
        socketService.on(eventName, data => {
          success(data);
        });
      };

      /** When game started options cannot change, so stop listening. */
      this.stopListenOptionsChanged = () => {
        socketService.off(roomEvents.resChangeNumberPlacesSuccess);
        socketService.off(roomEvents.resChangeTimeSuccess);
        socketService.off(roomEvents.resOtherUserTookPlace);
        // TODO got up?
      };

      //////////
      // USER //
      //////////

      this.takePlace = options => {
        let {roomId, placeId, callbacks: {success}} = options;
        this.data.player.placeId = placeId;
        socketService.emit(roomEvents.reqTakePlace, {
          roomID: roomId,
          placeId: placeId,
          login: authorizationService.login
        });

        this.listenTakePlace({
          callbacks: {
            success: success
          }
        });
      };

      this.listenTakePlace = options => {
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
      };

      this.getUp = options => {
        let {roomId, placeId, callbacks: {success}} = options;
        socketService.emit(roomEvents.reqGetUp, {
          roomID: roomId,
          placeId: placeId,
          login: authorizationService.login
        });
        this.listenGetUp({
          callbacks: {
            success: success
          }
        });
      };

      this.listenGetUp = options => {
        let eventName = roomEvents.resGetUp;
        socketService.on(eventName, data => {
          this.data.player.placeId = undefined;
          success(data);
          socketService.off(eventName);
        });
      };

      this.listenAskForStart = options => {
        let {callbacks: {success}} = options;
        let eventName = roomEvents.resAskPlayerStart;
        socketService.on(eventName, data => {
          success();
          socketService.off(eventName);
        });
      };

      this.listenNotStarted = options => {
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
      };
    }
  ]);
