/* jshint esversion: 6 */
const scrabbleEvents = require("./scrabble.events");
const Scrabble  = require("./scrabble.game").Scrabble;
const allScrabbles  = require("./scrabble.game").allScrabbles;

const scrabbleSocket = socket => {
  console.log(`ScrabbleSocket initialised`);
  socket.on(scrabbleEvents.reqDrawTiles, data => {
    let {gameId, number} = data;
    console.log(`Draw tiles for game: ${gameId}`);
    let promise = new Promise((res, rej) => {
      res(allScrabbles.getScrabble(gameId).drawInitialTiles());
    });

    promise.then(result => {
      console.log(`Tiles send to game: ${gameId}`);
      socket.emit(scrabbleEvents.resDrawTilesSuccess, JSON.stringify(result));
    });
  });
};

module.exports = {
  scrabbleSocket: scrabbleSocket
};
