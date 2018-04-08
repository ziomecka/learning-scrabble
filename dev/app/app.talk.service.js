/* jshint esversion: 6 */
angular
  .module("app")
  .service("appTalkService", [
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
        let {roomId, callbacks: {success}} = options;
        socketService.emit(appEvents.reqJoinedRoomDetails, {roomId: roomId});
        socketService.on(appEvents.resJoinedRoomDetails, data => {
          success(data);
        });
      };

      this.authorize = options => {
        let {data, callback: {success, failureLogin, failurePassword}} = options;
        socketService.emit(appEvents.reqAuthorize, data);
        socketService.on(appEvents.resAuthorizeSuccess, data => success(data));
        socketService.on(appEvents.resNoLogin, () => failureLogin());
        socketService.on(appEvents.resAuthorizeFailure, () => failurePassword());
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
        let {name, numberPlaces, createGame = true, callback: {success}} = options;
        $stateParams.numberPlaces = numberPlaces;
        socketService.emit(appEvents.reqCreateNewRoom, {
          name: name,
          numberPlaces: numberPlaces,
          createGame: createGame,
          login: authorizationService.login
        });
        this.createRoomSuccess(success);
      };

      this.createRoomSuccess = callback => {
        socketService.on(appEvents.resCreateNewRoom, data => callback(data));
      };

      this.newRoomAdded = options => {
        let {callback: {success}} = options;
        socketService.on(appEvents.resNewRoomAdded, data => {
          success(data);
        });
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
    }
  ]);
