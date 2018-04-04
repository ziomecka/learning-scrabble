/* jshint esversion: 6 */
angular
  .module("controlsModule")
  .directive("controlsVerify", () => {
    return {
      restrict: "A",
      templateUrl: "../controls.exchange.html"
    };
  });
