/* jshint esversion: 6 */
const scrabbleDirective = () => {
  return {
    templateUrl: "./scrabble.html",
    controller: require("./scrabble.controller"),
    controllerAs: "scrabbleCtrl"
  };
};

angular
  .module("scrabbleModule")
  .directive("scrabble", scrabbleDirective);
