/* jshint esversion: 6 */
const roomSidebar = () => {
  return {
    restrict: "E",
    templateUrl: "./room.sidebar.html",
  };
};

angular
  .module("roomModule")
  .directive("roomSidebar", roomSidebar);
