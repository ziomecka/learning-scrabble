/* jshint esversion: 6 */
import scrabbleControlsModule from "./controls/module.exports"; // eslint-disable-line no-unused-vars
import scrabbleRackModule from "./rack/module.exports"; // eslint-disable-line no-unused-vars
import scrabbleGameModule from "./game/module.exports"; // eslint-disable-line no-unused-vars

module.exports = angular.module("scrabblePlayerModule", [ // eslint-disable-line no-undef
  "scrabbleControlsModule",
  "scrabbleRackModule",
  "scrabbleGameModule"
]);
