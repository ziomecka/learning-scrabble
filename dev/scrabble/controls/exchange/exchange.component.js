/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .component("controlsExchange", {
    templateUrl: "../room.controls.exchange.html",
    controller: require("./exchange.controller")
  });
