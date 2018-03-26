/* jshint esversion: 6 */
const Rack = require("./scrabble.rack");
const Player = require("../server.player");

const players = new Map();

class ScrabblePlayer extends Player {
  constructor (options) {
    super(options);
    this.rack = new Rack();
    players.set([this.id, this]);
  }

  getsTile (tile) {
    tile.onRack = true;
    this.rack.getsTile(tile);
  }
}

module.exports.ScrabblePlayer = ScrabblePlayer;
