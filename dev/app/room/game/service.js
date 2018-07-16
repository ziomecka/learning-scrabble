/* jshint esversion: 6 */
class RoomGameService {
  constructor (
    scrabbleBoardService,
    scrabbleGameService,
    socketFactory
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleBoardService,
      scrabbleGameService,
      socketFactory
    });

    this.listens = [

    ];

    this.games = {
      "scrabble": () => {
        return scrabbleBoardService;
      }
    }
  }

  get gameService () {
    return this._gameService;
  }

  set gameService (game) {
    this._gameService = this.games[game]();
    return true;
  }

  get points () {
    return this.gameService.points;
  }

  get game () {
    // TODO setter needs a getter
  }

  set game (game) {
    this.gameService = "scrabble";

    Object.keys(game).forEach(key => {
      if (this[`_${key}`] === undefined || this[`_${key}`] === null) {
        this[`_${key}`] = game[key];
      }
      if (this[`${key}`] === undefined) {
        Object.defineProperty(this, key, {
          get() {
            return this[`_${key}`];
          }
        });
      }
    });

    this.gameService.board = this.board;
  }

  clear () {
    this.scrabbleGameService.clear();
    Object.keys(this).forEach(property => {
      if ({}.hasOwnProperty.call(this, property)) {
        if (Object.getPrototypeOf(property).hasOwnProperty("stopListen")) {
          property.stopListen();
        }
        if (Object.getPrototypeOf(property).hasOwnProperty("clear")) {
          property.clear();
        }
        // if (property !== "clear") {
        //   delete this[property];
        // }
      }
    }, this);
  }

  listen () {
    this.scrabbleGameService.listen();
  }

  stopListen () {
    this.scrabbleGameService.stopListen();
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomGameService", RoomGameService);
