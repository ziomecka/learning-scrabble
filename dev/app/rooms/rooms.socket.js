/* jshint esversion: 6 */
angular
  .module("roomsModule")
  .service("roomsSocket", [
    "socketService",
    "roomsEvents",
    "$stateParams",
    "routerGoService",
    "userData",
    function (socketService, roomsEvents, $stateParams, routerGoService, userData) {
      this.getRoomDetails = (options) => {
        let {callbacks: {success}} = options;
        socketService.emit(roomsEvents.reqJoinedRoomDetails, {
          roomId: options.roomId,
          login: userData.login
        });

        this.listenGetRoomDetails({
          callbacks: {
            success: success
          }
        });
      };

      this.listenGetRoomDetails = (options) => {
        let {callbacks: {success}} = options;
        let eventName= roomsEvents.resJoinedRoomDetails;
        socketService.on(eventName, data => {
          success(data);
          socketService.off(eventName);
        });
      };

      this.createRoom = options => {
        let {name, numberPlaces, createGame = true, joinRoom = true, callbacks: {success}} = options;
        $stateParams.numberPlaces = numberPlaces;
        socketService.emit(roomsEvents.reqCreateNewroom, {
          name: name,
          numberPlaces: numberPlaces,
          login: userData.login,
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
          routerGoService.go({
            state: auhtorizationStates.room,
            roomId: data.roomId
          });
        });
        // socketService.on (appEveents.resJoinedRoomDetails, data => {});
      };
    }
  ]);
