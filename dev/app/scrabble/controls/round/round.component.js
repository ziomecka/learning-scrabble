/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .component("controlsRound", {
    templateUrl: "../room.controls.round.html",
    controller: require("./round.controller")
  });
