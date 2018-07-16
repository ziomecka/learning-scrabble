/* jshint esversion: 6 */
class RoomsService {
  constructor (
    roomsSocket,
    roomsEvents,
    socketFactory,
    $state,
    routerStates
  ) {
    "ngInject";

    Object.assign(this, {
      roomsSocket,
      roomsEvents,
      socketFactory,
      $state,
      routerStates
    });

    this.leftGame = {};
    this._rooms = [];

    this.listens = [
      {
        name: this.roomsEvents.resNewroomAdded,
        callback: data => {
          data.add = true;
          this.rooms = data;
          // this.rooms = {
          //   add: true,
          //   roomsList: [data]
          // };
        }
      }
    ];
  }

  set rooms (options) {
    options = Array.from(Object(options));
    if(options.add !== true) {
      this._rooms = [...options];
    } else {
      this._rooms.push(...options);
      // console.log(`this._rooms ${angular.toJson(this._rooms)}`);
      // // console.log(`new room ${angular.toJson(options.roomsList)}`);
    }
  }

  get rooms () {
    return this._rooms;
  }

  initializeRooms (roomsList) {
    ({
      rooms: this.rooms,
      collection: this.collection
    } = roomsList);
    // this.collection = roomsList.collection;
    // ({
    //   "collection": this.collection,
    //   "list": this.rooms
    // } = roomsList);

    // this.rooms = {
    //   roomsList: roomsList.list,
    // };
    this.listen();
  }

  destroyRooms () {
    this.stopListen();
  }

  listen () {
    this.socketFactory.listen(this.listens);
  }

  stopListen () {
    this.socketFactory.stopListen(this.listens);
  }

  getRoomDetails (options) {
    this.roomsSocket.getRoomDetails({
      "data": {
        "collection": this.collection? this.collection : "scrabble",
        "roomId": options.roomId
      },
      "success": options.success,
      "failure": options.failure
    });
  }

  /** Return link for ui-sref. */
  joinRoom (options) {
    return `${this.routerStates.room}({
      roomId: "${options.roomId}",
      collection: "${options.collection}"
    })`;
    // collection: "${this.collection}"
    // ['#']: "${roomId}",
  }
}

angular // eslint-disable-line no-undef
  .module("roomsModule")
  .service("roomsService", RoomsService);
