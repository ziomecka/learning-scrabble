/* jshint esversion: 6 */
const directive = () => {
  return {
    templateUrl: "../room.controls.html",
    controller: require("./room.controls.controller"),
    controllerAs: "roomControlsCtrl"
  };
};

angular
  .module("roomModule")
  .directive("controlsRoom", directive);
