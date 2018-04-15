/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "scrabbleGameFactory",
  ($scope, scrabbleGameFactory) => {
    const me = $scope;

    /** Data shared by scrabbleGameFactory */
    me.data = scrabbleGameFactory.data;

    /** Round */
    me.roundOK = () => {
      scrabbleGameFactory.tilesPlaced();
    };

    me.roundExchange = () => {
      me.exchange = true;
    };

    me.roundResign = () => {
      scrabbleGameFactory.playerResigned();
    };

    /** Exchange tiles */
    me.exchangeOK = () => {
      scrabbleGameFactory.tilesExchanged();
    };

    me.exchangeResign = () => {
      me.exchange = false;
    };

    /** Accept word */
    me.verifyNo = () => {
      scrabbleGameFactory.acceptsWord();
    };

    me.verifyYes = () => {
      scrabbleGameFactory.verifiesWord();
    };
  }
];
