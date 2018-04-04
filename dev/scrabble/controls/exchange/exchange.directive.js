/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .directive("controlsExchange", () => {
    return {
      restrict: "A",
      templateUrl: "../controls.exchange.html"
    };
  });
