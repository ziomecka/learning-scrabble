/* jshint esversion: 6 */
const directive = () => {
  return {
    controller: require("./navigation.controller"),
    controllerAs: "navigationCtrl",
    templateUrl: "./rooms.navigation.html"
  };
};

angular
  .module("roomsModule")
  .directive("roomsNavigation", directive);
