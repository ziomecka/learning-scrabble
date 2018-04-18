/* jshint esversion: 6 */
const newroomDirective = () => {
  return {
    restrict: "E",
    templateUrl: "./rooms.newroom.html",
    controller: require("./newroom.controller"),
    controllerAs: "newroomCtrl"
  };
};

angular
  .module("roomsModule")
  .directive("newroom", newroomDirective);
