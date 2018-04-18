/* jshint esversion: 6 */
const roomGame = () => {
  return {
    restrict: "E",
    templateUrl: "./room.game.html",
  };
};

angular
  .module("roomModule")
  .directive("roomGame", roomGame);
