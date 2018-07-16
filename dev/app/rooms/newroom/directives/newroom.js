/* jshint esversion: 6 */
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";
  return {
    restrict: "E",
    templateUrl: path.resolve(appTemplates.roomsNewroom),
    controller: require("../controller"),
    controllerAs: "newroomCtrl"
  };
};

angular // eslint-disable-line no-undef
  .module("roomsModule")
  .directive("newroom", directive);
