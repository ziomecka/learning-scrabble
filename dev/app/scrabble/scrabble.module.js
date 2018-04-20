/* jshint esversion: 6 */
angular.module("scrabbleModule", [
  "boardModule",
  "playerModule",
  "tileModule"
]);

import playerModule from "./player/player";
import boardModule from "./board/board";
import tileModule from "./tile/tile";
