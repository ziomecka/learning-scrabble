/* jshint esversion: 6 */
const scrabblePlayerDirective = () => {
  const link = (scope, element, attrs) => {
  };

  return {
    templateUrl: "../scrabble.player.html",
    link: link,
    controller: require("./player.controller"),
    controllerAs: "playerCtrl"
  };
};

angular
  .module("playerModule")
  .directive("scrabblePlayer", scrabblePlayerDirective);
