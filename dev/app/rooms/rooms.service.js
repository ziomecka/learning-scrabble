/* jshint esversion: 6 */
class RoomsService {
  constructor (
    roomsSocket,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      roomsSocket,
      userData
    });

    this.login = userData.login;
    this.buttonsDisabled = false;
    this.leftGame = {};
    this._rooms = [];
  }

  set rooms (options) {
    if (options.add !== true) {
      this._rooms = [...options.roomsList];
    } else {
      this._rooms.push(...options.roomsList);
    }
  }

  get rooms () {
    return this._rooms;
  }

  initializeRooms (roomsList) {
    this.buttonsDisabled = false;
    this.rooms = {
      roomsList: roomsList,
    };
  }

  joinRoom (id) {
    this.buttonsDisabled = true;
    this.roomsSocket.joinRoom({
      data: {
        roomdId: id
      },
      failure: () => {
        this.buttonsDisabled = false;
      }
    });
  }
}

angular
  .module("roomsModule")
  .service("roomsService", RoomsService);
