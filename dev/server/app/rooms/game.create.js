/* jshint esversion: 6 */
const Scrabble = require("../../scrabble/scrabble.game").Scrabble;
const messages = require("./rooms.messages");

const createGame = () => {
  const create = data => {
    console.log(`New game will be created.`);
    let promise = new Promise((res, rej) => {
      try {
        new Scrabble({"id": data.roomId});
        res(messages.gameCreateSuccess(data.roomId));
      } catch (e) {
        rej(messages.gameCreateFailure(e.message));
      }
    });
    return promise;
  };

  return {
    create: create
  };
};

module.exports = {
  createGame: createGame,
};
