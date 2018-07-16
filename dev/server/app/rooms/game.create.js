/* jshint esversion: 6 */
const Scrabble = require("../../scrabble/scrabble.game").Scrabble;

const create = data => {
  new Scrabble({"id": data.roomId});
  return true;
};

module.exports = {
  create: create
};
