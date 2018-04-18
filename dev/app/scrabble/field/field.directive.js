/* jshint esversion: 6 */
const fieldDirective = () => {
  return {
    restrict: "E",
    templateUrl: "scrabble.field.html",
    scope: {
      fieldInfo: "=field",
    }
  };
};

angular
  .module("boardModule")
  .directive("scrabbleField", fieldDirective);
