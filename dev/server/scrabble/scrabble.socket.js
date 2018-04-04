/* jshint esversion: 6 */
const mongoGame = require("../mongo/scrabble/game/game.mongo.insert");

const createScrabble = options => {
  let {callbacks: {success}} = options;
  console.log("Creating scrabble");
  let mongoGamePromise = new Promise((res, rej) => {
    mongoGame.oninsert = data => res(data);
    mongoGame.onerror = err => rej(`Insert game promise rejected: ${err}`);
    mongoGame.insert();
  });
  mongoGamePromise.then(data => {
    success(data);
    console.log(`Game with id: ${data.id} has been created.`);
  }).catch(reason => console.log(reason));
};

const scrabbleSocket = socket => {
};

module.exports = {
  scrabbleSocket: scrabbleSocket,
  createScrabble: createScrabble
};
