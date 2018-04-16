/* jshint esversion: 6 */
angular
  .module("tileModule")
  .directive("tile", data => {
    return {
      restrict: "A",
      templateUrl: "../room.tile.html",
      link: data => {
        let {letter, points} = data;
      }
    };
  });
