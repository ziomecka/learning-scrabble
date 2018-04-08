/* jshint esversion: 6 */
const Player = require("./scrabble.player").Player;
const Bag = require("./scrabble.bag").Bag;
const Board = require("./scrabble.board").Board;
const Round = require("./scrabble.round").Round;
const allRooms = require("../app/app.room").allRooms;
const accessMap = require("../app/app.access.map");

const scrabbles = new Map();

class Scrabble {
  constructor (options) {
    options = Object(options);
    /** Id should be the same as room's id (only one game in a room).*/
    ({
      number: this.number = 2,
      lang: this.lang = "Polish",
      time: this.time = 5,
      id: this.id
    } = options);

    // this.defaults = Object.assign(defaults, defaultsLang[lang]);
    /** Players */
    this.players = [];

    this.boardSize = 15;
    this.initialNumberTiles = 7;
    /** initialised when game started */
    this.board = new Board({lang: this.lang, size: this.size});
    this.bag = new Bag({lang: this.lang});
    // this.controls = ["ok", "exchange", "check", "resign"];
    // this._states = new Map([
    //   ["tilesToBePlayed", Symbol("tilesToBePlayed")],
    //   ["tilesToBeExchanged", Symbol("tilesToBeExchanged")],
    //   ["moveEnded", Symbol("moveEnded")]
    // ]);
    // this._state = this._states.get("tilesToBePlayed");

    /** Add to map. */
    scrabbles.set([this.id, this]);
  }

  addPlayers (options) {
    for (let i = 0, num = options.number; i < num; i++) {
      this.players.push(new Player({
        time: this.time * 60000,  // converted to miliseconds
        name: options.name
      }));
    }
  }

  start () {
    /* Bag has to be ready before players start to draw tiles */
    /* Game has to be ready before players start to draw tiles */
    for (let player of this.players) {
      this.drawTiles(player, this.initialNumberTiles);
    }
    /* Who starts? */
    let random = Math.floor(Math.random() * this.players.length);
    this.startRound(this.players[random]);
    return {
    };
  }

  drawInitialTiles () {
    this.players.forEach(player => {
      for(let i = 0, num = this.initialNumberTiles; i < num; i++) {
        this.bag.draw(player);
      }
    });
    let result = {};
    // ([{id, tiles = result[id]}] = this.players);
    return result;
  }

  drawTiles (options) {
    let {player, num} = options;
    for (let i = 0, len = num; i < num; i ++) {
      this.bag.draw(player);
    }
  }

  startRound (player) {
    this.round = new Round({player: player});
  }

  endRound () {
    this.round = null;
  }

  toJSON () {
    return {
      id: this.id,
      players: this.players
    };
  }
}

const allScrabbles = accessMap(scrabbles);

module.exports = {
  Scrabble: Scrabble,
  allScrabbles: allScrabbles
};
