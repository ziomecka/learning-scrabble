let Scrabble = require("../../scrabble/scrabble.game").Scrabble;
// let Scrabble = require("./scrabble/scrabble");
module.exports = {
  "scrabble": options => new Scrabble(options)
}
