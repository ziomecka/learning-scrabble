/* jshint esversion: 6 */
import angular from "angular";

angular.module("scrabbleModule", [
  "boardModule",
  // "bagModule",
  "playerModule",
  "controlsModule"
]);

import controlsModule from "./controls/controls";
import playerModule from "./player/player";
import boardModule from "./board/board";
// import bagModule from "./bag/bag";
