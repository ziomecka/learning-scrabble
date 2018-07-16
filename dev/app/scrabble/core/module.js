/* jshint esversion: 6 */
/* eslint-disable no-unused-vars */
import scrabbleBoardModule from "../board/module.exports";
import scrabbleTileModule from "../tile/module.exports";
import scrabblePlayerModule from "../player/module.exports";
import scrabbleObserverModule from "../observer/module.exports";
/* eslint-enable no-unused-vars */

/* eslint-disable no-undef */
module.exports = angular.module("scrabbleModule", [
  "scrabbleBoardModule",
  "scrabbleTileModule",
  "scrabblePlayerModule",
  "scrabbleObserverModule"
]);
/* eslint-enable no-undef */
