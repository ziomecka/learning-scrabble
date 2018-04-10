/* jshint esversion: 6 */
angular
  .module("app")
  .directive("title", [
    "appTitle",
    appTitle => {
      return {
        restrict: "A",
        templateUrl: "../index.title.html",
        link: ($scope) => {
          $scope.title = appTitle;
        }
      };
    }
  ]);
