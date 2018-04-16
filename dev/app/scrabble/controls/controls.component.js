/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .component("gameControls", {
    templateUrl: "../room.game.controls.html",
    controller: require("./verify.controller")
  });
