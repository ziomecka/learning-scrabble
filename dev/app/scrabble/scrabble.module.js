/* jshint esversion: 6 */
angular.module("scrabbleModule", [
  "boardModule",
  "playerModule",
  "controlsModule",
  "tileModule"
]);

import controlsModule from "./controls/controls";
import playerModule from "./player/player";
import boardModule from "./board/board";
import tileModule from "./tile/tile";
