/* jshint esversion: 6 */
const path = require("path");
const roomSidebar = (
  appTemplates
) => {
  "ngInject";

  return {
    restrict: "E",
    transclude: {
      "playersRoom": "?playersRoom",
      "controlsRoom": "?controlsRoom",
      "roomGameSidebar": "?roomGameSidebar",
      "optionsRoom": "?optionsRoom",
      "usersRoom": "?usersRoom"
    },
    replace: true,
    templateUrl: path.resolve(appTemplates.roomSidebar)
  };
};

angular // eslint-disable-line no-undef
  .module("roomModule")
  .directive("roomSidebar", roomSidebar);
