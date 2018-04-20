/* jshint esversion: 6 */
module.exports = class ScrabbleConstrolsController {
  constructor (scrabbleGameFactory) {
    "ngInject";
    this.scrabbleGameFactory = scrabbleGameFactory;
    this.exchange = false;

    /** Data shared by scrabbleGameFactory */
    // TODO out
    this.data = scrabbleGameFactory.data;
  }

  /** Round */
  roundOK () {
    this.scrabbleGameFactory.tilesPlaced();
  }

  roundExchange () {
    this.exchange = true;
  }

  roundResign () {
    this.scrabbleGameFactory.playerResigned();
  }

  /** Exchange tiles */
  exchangeOK () {
    this.scrabbleGameFactory.tilesExchanged();
  }

  exchangeResign () {
    this.exchange = false;
  }

  /** Accept word */
  verifyNo ()  {
    this.scrabbleGameFactory.acceptsWord();
  }

  verifyYes () {
    this.scrabbleGameFactory.verifiesWord();
  }
};
