/* jshint esversion: 6 */
angular
  .module("scrabbleModule")
  .constant("srabbleEvents", {
    reqCreateScrabble: "scrabble: create game",
    resScrabbleCreated: "scrabble: game has been created",
    resInitialTiles: "scrabble: your initial tiles",
    resRoundStarted: "scrabble: your round has started",
    reqExchangeTiles: "scrabble: exchange tiles",
    resTilesExchanged: "scrabble: tiles have been exchanged",
    resWordRejected: "",
    resRoundEnded: "",
    reqVerifyWord: "",
    reqEndRound: "scrabble: end round"
  });
