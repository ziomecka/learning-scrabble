/* jshint esversion: 6 */
const scrabbleRackDirective = () => {
  "ngInject";

  const link = (scope, element, attrs) => {
  };

  return {
    restrict: "E",
    link: link,
    controller: require("./rack.controller"),
    controllerAs: "rackCtrl",
    templateUrl: "../scrabble.rack.html"
  };
};

angular
  .module("rackModule")
  .directive("scrabbleRack", scrabbleRackDirective);
