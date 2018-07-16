/* jshint esversion: 6 */
module.exports = class RoomsController {
  constructor (
    roomsSocket,
    roomsList,
    roomsService,
    authorizationService,
    userData,
    lodashFactory,
    alphanumSortFactory
  ) {
    "ngInject";

    Object.assign(this, {
      roomsSocket,
      roomsList,
      roomsService,
      authorizationService,
      userData,
      lodashFactory,
      alphanumSortFactory
    });

    this._showRoomsList = false;
    this._showNewroom = false;
  }

  get login () {
    return this.userData.login;
  }

  get rooms () {
    return this.roomsService.rooms;
  }

  logout () {
    this.authorizationService.unauthorize();
  }

  $onInit () {
    this.roomsService.initializeRooms(this.roomsList);
  }

  $onDestroy () {
    this.roomsService.destroyRooms();
  }

  joinRoom (roomId) {
    return this.roomsService.joinRoom({
      "roomId": roomId,
      "collection": "scrabble"
    });
  }

  get sortedRooms() {
    // TODO improve
    // algorithm
    // what is better here or in filter???
    let sign = "=";
    return this.alphanumSortFactory(
      this.rooms.map(item => {
        return `${item.name}${sign}${item._id}`;
      })
    )
    .map(item => {
      let i = item.indexOf(sign);
      return {
        "name": item.slice(0, i),
        "_id": item.slice(i + sign.length)
      };
    });
  }
};
