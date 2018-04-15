/* jshint esversion: 6 */
angular
  .module("roomsModule")
  .service("roomsSocket", [
    "socketService",
    "roomsEvents",
    "$stateParams",
    "authorizationService",
    "authorizationUserData",
    function (socketService, roomsEvents, $stateParams, authorizationService, authorizationUserData) {
      this.getAllRooms = options => {
        let {callback} = options;
        socketService.emit(roomsEvents.reqAllRooms);
        socketService.on(roomsEvents.resAllRooms, data => callback(data));
      };

      this.createRoom = options => {
        let {name, numberPlaces, createGame = true, joinRoom = true, callbacks: {success}} = options;
        $stateParams.numberPlaces = numberPlaces;
        socketService.emit(roomsEvents.reqCreateNewroom, {
          name: name,
          numberPlaces: numberPlaces,
          login: authorizationUserData.login,
          createGame: createGame,
          joinRoom: joinRoom
        });
        this.createRoomSuccess(success);
      };

      this.createRoomSuccess = callback => {
        socketService.on(roomsEvents.resCreateNewroom, data => callback(data));
      };

      // this.newRoomAdded = options => {
      //   let {callbacks: {success}} = options;
      //   socketService.on(roomsEvents.resNewroomAdded, data => {
      //     success(data);
      //   });
      // };

      /** Join room and
          listen to room details */
      this.joinRoom = options => {
        let {id, callbacks: {successJoinRoom}} = options;
        socketService.emit(roomsEvents.reqJoinRoom, {"id": id});
        socketService.on(roomsEvents.resRoomJoinedSuccess, data => {
          successJoinRoom();
          authorizationService.go({
            state: auhtorizationStates.room,
            roomId: data.roomId
          });
        });
        // socketService.on (appEveents.resJoinedRoomDetails, data => {});
      };
    }
  ]);
