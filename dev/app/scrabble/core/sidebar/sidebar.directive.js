/* jshint esversion: 6 */
const scrabbleSidebarDirective = () => {
  return {
    restrict: "E",
    templateUrl: "./scrabble.sidebar.html"
  };
};

angular
  .module("scrabbleModule")
  .directive("scrabbleSidebar", scrabbleSidebarDirective);
