/* jshint esversion: 6 */
class RoomUsersService {
  constructor (
    roomEvents,
    socketFactory
  ) {
    "ngInject";

    Object.assign(this, {
      roomEvents,
      socketFactory
    });

    this._users = [];

    this.listens = [
      {
        name: this.roomEvents.resOtherUserJoinedRoom,
        callback: data => {
          this.addUser(data);
        }
      },
      {
        name: this.roomEvents.resOtherUserLeftRoom,
        callback: data => {
          this.removeUser(data);
        }
      }
    ];
  }

  clear () {
    this._users = [];
  }

  get users () {
    return this._users;
  }

  set users (arr) {
    this._users = arr;
  }

  addUser (data) {
    this._users.push(data.login);
  }

  removeUser (data) {
    let users = this._users;
    users.splice(users.findIndex(item => {
      return item === data.login;
    }), 1);
    users = null;
  }

  listen () {
    this.socketFactory.listen(this.listens);
  }

  stopListen () {
    this.socketFactory.stopListen(this.listens);
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomUsersService", RoomUsersService);
