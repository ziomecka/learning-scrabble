/* jshint esversion: 6 */
import controlsModule from "./controls/controls";
import rackModule from "./rack/rack";
import gameModule from "./game/game";

angular.module("playerModule", [
  "controlsModule",
  "rackModule",
  "gameModule"
]);
