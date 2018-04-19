/* jshint esversion: 6 */
angular.module("scrabbleModule", [
  "boardModule",
  "playerModule",
  "controlsModule",
  "tileModule",
  "rackModule"
]);

import controlsModule from "./controls/controls";
import playerModule from "./player/player";
import boardModule from "./board/board";
import tileModule from "./tile/tile";
import rackModule from "./rack/rack";
