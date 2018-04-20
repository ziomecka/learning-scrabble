/* jshint esversion: 6 */
import controlsModule from "./controls/controls";
import rackModule from "./rack/rack";

angular.module("playerModule", [
  "controlsModule",
  "rackModule"
]);
