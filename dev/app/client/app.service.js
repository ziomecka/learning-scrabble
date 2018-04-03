/* jshint esversion: 6 */
angular
  .module("app")
  .service("appService", [
    "socketService",
    "appEvents",
    "$stateParams",
    "authorizationService",
    function (socketService, appEvents, $stateParams, authorizationService) {
      this.connection = () => {
        socketService.on(appEvents.resConnected, data => console.log("I'm connected"));
        socketService.on("disconnect", () => console.log("I have been disconnected"));
      };

      this.removeListeners = () => {
        socketService.getSocket().removeAllListeners();
      };

      this.getAllRooms = options => {
        let {callback} = options;
        socketService.emit(appEvents.reqAllRooms);
        socketService.on(appEvents.resAllRooms, data => callback(data));
      };

      this.getRoomDetails = options => {
        let {callback} = options;
        socketService.emit(appEvents.reqJoinedRoomDetails, {roomId: $stateParams.roomId});
        socketService.on(appEvents.resJoinedRoomDetails, data => callback(data));
      };

      this.authorize = options => {
        let {data, callback: {success, failureLogin, failurePassword}} = options;
        socketService.emit(appEvents.reqAuthorize, data);
        socketService.on(appEvents.resAuthorizeSuccess, data => success(data));
        socketService.on(appEvents.resNoLogin, () => failureLogin());
        socketService.on(appEvents.resAuthorizeFailed, () => failurePassword());
      };

      this.createUser = options => {
        let {data, callback: {failureLogin}} = options;
        socketService.emit(appEvents.reqNewuser, data);
        socketService.on(appEvents.resDuplicatedLogin, () => loginNotUnique = true);
        socketService.on(appEvents.resNewuser, data => {
          authorizationService.authorize(data);
          authorizationService.go();
        });
      };

      this.createRoom = options => {
        let {name, numberPlaces, callback: {successCreateRoom}} = options;
        $stateParams.numberPlaces = numberPlaces;
        socketService.emit(appEvents.reqCreateNewRoom, {
          name: name,
          numberPlaces: numberPlaces,
          login: authorizationService.login
        });
        socketService.on(appEvents.resCreateNewRoom, data => successCreateRoom(data));
      };

      this.newRoomAdded = options => {
        let {callback: {successNewRoomAdded}} = options;
        socketService.on(appEvents.resNewRoomAdded, data => successNewRoomAdded(data));
      };

      this.joinRoom = options => {
        let {id, callback: {successJoinRoom}} = options;
        socketService.emit(appEvents.reqJoinRoom, {"id": id});
        socketService.on(appEvents.resRoomJoined, data => {
          successJoinRoom();
          authorizationService.go({
            state: auhtorizationStates.room,
            roomId: data.roomId
          });
        });
      };

      this.changeNumberPlaces = options => {
        let {id, number, callback: {successIncreased}} = options;
        socketService.emit(appEvents.reqNumberPlacesChanged, {
          id: id,
          number: number
        });

        socketService.on(appEvents.resPlacesAdded, data => {
          successIncreased(data);
          console.log("New places created");
        });
      };

      this.takePlace = options => {
        let {roomId, placeId, callback: {successTakePlace}} = options;

        socketService.emit(appEvents.reqTakePlace, {
          roomID: roomId,
          placeId: placeId,
          login: authorizationService.login
        });
        console.log("I try to take place");

        socketService.on(appEvents.resTakePlace, data => {
          successTakePlace(data);
          console.log("I took place");
        });
      };

      this.getUp = options => {
        let {roomId, placeId, callback: {successGetUp}} = options;
        socketService.emit(appEvents.reqGetUp, {
          roomID: roomId,
          placeId: placeId,
          login: authorizationService.login
        });
        console.log("I get up.");

        socketService.on(appEvents.resGetUp, data => {
            successGetUp(data);
            console.log("I've got up");
        });
      };

      this.askPlayerStart = options => {
        let {callback: {successAskPlayerStart}} = options;
        socketService.on(appEvents.resAskPlayerStart, () => {
          successAskPlayerStart();
          console.log("Ask player to start.");
        });
      };
    }
  ]);
