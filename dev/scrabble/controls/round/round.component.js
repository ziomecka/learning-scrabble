/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .component("controlsRound", {
    templateUrl: "../room.controls.exchange.html",
    controller: require("./round.controller")
  });
