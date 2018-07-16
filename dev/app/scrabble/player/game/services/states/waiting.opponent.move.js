/* jshint esversion: 6 */
class ScrabbleWaitingOpponentMove {
  constructor (
    scrabbleEvents,
    scrabbleStatesService,
    socketFactory
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleEvents,
      scrabbleStatesService,
      socketFactory
    });

    this.listens = [
      {
        /** Opponent placed word. Player accepts it. */
        name: scrabbleEvents.resOpponentWord,
        callback: (data) => {
          this.scrabbleBoardService.placeTiles(data.tiles);
          this.state = "acceptOpponentWord";
        }
      },
      {
        name: scrabbleEvents.resOpponentExchange,
        callback: (data) => {
          this.scrabbleLog.log = data;
        }
      },
      {
        name:scrabbleEvents.resOpponentResign,
        callback: (data) => {
          this.scrabbleLog.log = data;
        }
      },
      {
        /* Player can place word */
        name: scrabbleEvents.resStartRound,
        callback: data => {
          this.acceptTiles(data.tiles);
          this.state = "movePlaceWord";
          // offEvents: [
          //   scrabbleEvents.resOpponentWord,
          //   scrabbleEvents.resOpponentExchange,
          //   scrabbleEvents.resOpponentResign
          // ]
        }
      }
    ];
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
  .service("scrabbleWaitingOpponentMove", ScrabbleWaitingOpponentMove);
