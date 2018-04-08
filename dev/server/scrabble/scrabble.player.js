/* jshint esversion: 6 */
const Player = require("../app/app.player").Player;

const players = new Map();

class ScrabblePlayer extends Player {
  constructor (options) {
    super(options);
    this.tiles = new Array(7);
    players.set([this.id, this]);
  }

  getsTile (tile) {
    let index = this.tiles.findIndex((element) => element === undefined);
    this.index[index] = tile;
  }
}

module.exports = {
  Player: ScrabblePlayer
};
