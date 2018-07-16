/* jshint esversion: 6 */
const Player = require("../app/room/player.class").Player;
const socketsManager = require("../app/authorization/authorization.sockets.manager");
const players = new Map();

class ScrabblePlayer extends Player {
  constructor (options) {
    super(options);
    this.tiles = [];
    players.set([this.id, this]);
    this._state = "waitingForPlayers";
  }

  static isPlayer (object) {
    return (object && object instanceof this);
  }

  set socketId (value) {
      // TODO remove setting
  }

  get socketId () {
    return socketsManager.getId(this.login);
    // return socketsManager.getId(this.login);
  }

  set state (state) {
    this._state = state;
  }

  get state () {
    return this._state;
  }

  getsTile (tile) {
    // let index = this.tiles.findIndex((element) => element === undefined);
    // this.index[index] = tile;
    if (this.tiles.length < 7) {
      this.tiles.push(tile);
      return true;
    }
    return false;
  }

  toJSON () {
    return {
      tiles: this.tiles,
      login: this.login,
      // name: this.name,
      time: this.time,
      points: this.points,
      id: this.id,
      socketId: this.socketId || undefined
    };
  }
}

module.exports = {
  Player: ScrabblePlayer
};
