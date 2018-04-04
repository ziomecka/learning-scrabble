/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .component("controlsVerify", {
    templateUrl: "../room.controls.verify.html",
    controller: require("./verify.controller")
  });
