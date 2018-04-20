/* jshint esversion: 6 */
class RoomsSocket {
  constructor (
    socketService,
    roomsEvents,
    $stateParams,
    routerGoService,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      socketService,
      roomsEvents,
      $stateParams,
      routerGoService,
      userData
    });
  }

  getRoomDetails (options) {
    let {callbacks: {success}} = options;
    this.socketService.emit(this.roomsEvents.reqJoinedRoomDetails, {
      roomId: options.roomId,
      login: this.userData.login
    });

    this.listenGetRoomDetails({
      callbacks: {
        success: success
      }
    });
  }

  listenGetRoomDetails (options) {
    let {callbacks: {success}} = options;
    let eventName= this.roomsEvents.resJoinedRoomDetails;
    this.socketService.on(eventName, data => {
      success(data);
      this.socketService.off(eventName);
    });
  }

  createRoom (options) {
    let {name, numberPlaces, createGame = true, joinRoom = true, callbacks: {success}} = options;
    this.$stateParams.numberPlaces = numberPlaces;
    this.socketService.emit(this.roomsEvents.reqCreateNewroom, {
      name: name,
      numberPlaces: numberPlaces,
      login: this.userData.login,
      createGame: createGame,
      joinRoom: joinRoom
    });
    this.createRoomSuccess(success);
  }

  createRoomSuccess (callback) {
    this.socketService.on(this.roomsEvents.resCreateNewroom, data => callback(data));
  }

  // this.newRoomAdded = options => {
  //   let {callbacks: {success}} = options;
  //   this.socketService.on(this.roomsEvents.resNewroomAdded, data => {
  //     success(data);
  //   });
  // };

  /** Join room and
  listen to room details */
  joinRoom (options) {
    let {id, callbacks: {successJoinRoom}} = options;
    this.socketService.emit(this.roomsEvents.reqJoinRoom, {"id": id});
    this.socketService.on(this.roomsEvents.resRoomJoinedSuccess, data => {
      successJoinRoom();
      this.routerGoService.go({
        state: auhtorizationStates.room,
        roomId: data.roomId
      });
    });
    // this.socketService.on (appEveents.resJoinedRoomDetails, data => {});
  }
}

angular
  .module("roomsModule")
  .service("roomsSocket", RoomsSocket);
