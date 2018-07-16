/* jshint esversion: 6 */
const Player = require("./scrabble.player").Player;
const Bag = require("./scrabble.bag").Bag;
const Board = require("./scrabble.board").Board;
const Round = require("./scrabble.round").Round;
const allRooms = require("../app/room/room.class").allRooms;
const accessMap = require("../app/handlers/app.access.map");

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
    this.board = new Board(options.board);
    this.bag = new Bag(options.bag);
    // this.controls = ["ok", "exchange", "check", "resign"];
    // this._states = new Map([
    //   ["tilesToBePlayed", Symbol("tilesToBePlayed")],
    //   ["tilesToBeExchanged", Symbol("tilesToBeExchanged")],
    //   ["moveEnded", Symbol("moveEnded")]
    // ]);
    // this._state = this._states.get("tilesToBePlayed");

    /** Add to map. */
    scrabbles.set([this.id, this]);

    this._currentPlayerInd = -1;
    this._state = "waitingInitialTiles";
    this._lastFields = []; // TODO move to board
  }

  set state (state) {
    this._state = state;
  }

  get state () {
    return this._state;
  }

  addPlayer (options) {
    // console.log(`adding player to scrabble Instance ${options.name}.`);
    this.players.push(new Player({
      time: this.time * 60000,  // converted to miliseconds
      login: options.login
    }));
    return this.players[this.players.length - 1];
  }

  addPlayers (options) {
    // console.log(`adding players to Scrabble instance ${JSON.stringify(options)}.`);
    options = Array.from(options);

    options.forEach(player => {
      this.addPlayer(player);
    });

    options = null;
  }

  isPlayer (object) {
    return object instanceof Player;
  }

  drawInitialTiles (num = 7, players = this.players) {
    // console.log(`drawing initial tiles for players: .`);
    // console.log(JSON.stringify(this.players));
    let noInitialTiles = players.some(player => {
      return (
        !player.intialTiles ||
        player.intialTiles.length === 0
      );
    });

    if (noInitialTiles) {
      players.forEach(player => {
        this.drawTiles({
          "player": player,
          "num": num
        });
        // // if (this.isPlayer(player)) {
        //   for(let i = 0, num = this.initialNumberTiles; i < num; i++) {
        //     let tile = this.bag.draw();
        //     // console.log(`player gets tile: ${JSON.stringify(tile)}`);
        //     // console.log(`player before gets tile: ${JSON.stringify(player)}`);
        //     player.getsTile(tile);
        //     // console.log(`player after gets tile: ${JSON.stringify(player)}`);
        //   }
        // // }
      });
      return true;
    }
    // console.log(`initial tiles drawn ${JSON.stringify(this.players)}.`);
    return false;
  }

  drawTiles (options) {
    let {player, num} = options;
    let tile;
    for (let i = 0; i < num; i ++) {
      tile = this.bag.draw();
      player.getsTile(tile);
    }
    tile = null;
  }

  get currentPlayerInd () {
    return this._currentPlayerInd;
  }

  get numberPlayers () {
    return this.players.length;
  }

  get lastWord () {
    return this._lastFields.map(lastField => {
      return lastField._tile.letter;
    }).join("");
  }

  getOpponents (property = "socketId") {
    let currentPlayerInd = this.currentPlayerInd;
    return this.players.reduce((acc, cv, ind) => {
      if (ind !== currentPlayerInd) {
        acc.push(cv[property]);
      }
      return acc;
    }, []);
  }

  set currentPlayerInd (int) {
    if (Number.isInteger(int) && int >=0 && int < this.numberPlayers) {
      this._currentPlayerInd = int;
    } else {
      // TODO throw Error
    }
  }

  start () {
    /* Who starts? */
    this.currentPlayerInd = Math.floor(Math.random() * this.numberPlayers);
    this._state = "movePlaceWord";
    return this.players[this.currentPlayerInd];
  }

  placeTiles (fields) {
    this._lastFields = fields;
    this.board.placeTiles(fields);
  }

  _goToNextPlayer () {
    let next = this.currentPlayerInd + 1;
    let isCorrect = i => i >= 0 && i < this.numberPlayers;
    this.currentPlayerInd = (isCorrect(next))? next : 0;
    isCorrect = null;
    return this.currentPlayerInd;
  }

  nextPlayer () {
    return this.players[this._goToNextPlayer()];
  }

  exchangeTiles (data) {
    return this.bag.exchange.tiles(data);
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
      players: this.players,
      board: this.board,
      bag: this.bag
    };
  }
}

const allScrabbles = accessMap(scrabbles);

module.exports = {
  Scrabble: Scrabble,
  allScrabbles: allScrabbles
};
