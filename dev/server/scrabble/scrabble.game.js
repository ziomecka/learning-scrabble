/* jshint esversion: 6 */
const UUID = require("uuid");
const scrabbles = new Map();

class Scrabble {
  constructor (options) {
    options = Object(options);
    let {players: players, lang: lang = "Polish", time: time = 5} = options;
    this.id = UUID();
    /** add to map */
    scrabbles.set([this.id, this]);
    this.lang =  lang;
    this.defaults = Object.assign(defaults, defaultsLang[lang]);

    if(!players || !Array.isArray(players) || players.some((player) => typeof player !== "string")) {
      players = this.defaults.players.slice(0, 2);
    }

    this.players = [];
    players.forEach((player, index) => this.players.push(new Player({
      name: player,
      time: time * 60000,
      id: index
    })));
    this.size = 15;
    this.numberOfTiles = 7;
    /** initialised when game started */
    this.board = null;
    this.bag = null;
    this.controls = ["ok", "exchange", "check", "resign"];
    this._states = new Map([
      ["tilesToBePlayed", Symbol("tilesToBePlayed")],
      ["tilesToBeExchanged", Symbol("tilesToBeExchanged")],
      ["moveEnded", Symbol("moveEnded")]
    ]);
    this._state = this._states.get("tilesToBePlayed");

    players = null;
  }

  start () {
    /* Bag has to be ready before players start to draw tiles */
    this.prepareTools();
    this.drawGame();
    /* Game has to be ready before players start to draw tiles */
    this.preparePlayers();
    /* Who starts? */
    let random = Math.floor(Math.random() * this.players.length);
    this.startRound(this.players[random]);
  }

  prepareTools () {
    this.board = new Board({lang: this.lang, size: this.size});
    this.bag = new Bag({lang: this.lang, game: this});
  }

  preparePlayers () {
    for (let player of this.players) {
      this.drawTiles(player, this.numberOfTiles);
    }
  }

  drawTiles (player, num) {
    for (let i = 0, len = num; i < num; i ++) {
      this.bag.draw(player);
    }
  }

  startRound (player) {
    this.round = new Round(this, player);
  }

  endRound () {
    this.round = null;
  }
}

const allScrabbles = {
  getScrabble: id => scrabbles.get(id),
  destroyScrabble: id => scrabbles.delete(id)
};

module.exports.Scrabble = Scrabble;
module.exports.allScrabbles = allScrabbles;
