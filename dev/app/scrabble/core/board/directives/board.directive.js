/* jshint esversion: 6 */
const boardDirective = () => {
  "ngInject";
  return {
    restrict: "E",
    templateUrl: "scrabble.board.html",
    controller: require("../board.controller"),
    controllerAs: "boardCtrl"
  };
};

angular
  .module("boardModule")
  .directive("scrabbleBoard", boardDirective);
