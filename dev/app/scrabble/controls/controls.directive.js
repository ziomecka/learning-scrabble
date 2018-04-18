/* jshint esversion: 6 */
const controlsDirective = () => {
  return {
    restrict: "E",
    templateUrl: "./scrabble.controls.html",
    controller: require("./controls.controller"),
    controllerAs: "scrabbleControlsCtrl"
  };
};

angular
  .module("scrabbleModule")
  .directive("scrabbleSidebar", controlsDirective);
