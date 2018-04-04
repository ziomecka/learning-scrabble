/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .directive("controlsRound", () => {
    return {
      restrict: "A",
      templateUrl: "../controls.exchange.html"
    };
  });
