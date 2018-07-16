const scrabbleGame = require("./scrabble/game/create.document").create;
const scrabblePlayer = require("./scrabble/player/create.document").create;

module.exports = {
  "scrabble": {
    "game": options => scrabbleGame(options),
    "player": options => scrabblePlayer(options)
  }
};
