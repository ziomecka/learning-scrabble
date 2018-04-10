/* jshint esversion: 6 */
angular
  .module("roomModule")
  .component("controlsRoom", {
    templateUrl: "../room.controls.html",
    controller: require("./controls.controller")
  });
