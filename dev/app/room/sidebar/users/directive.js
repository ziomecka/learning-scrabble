/* jshint esversion: 6 */
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";

  return {
    restrict: "E",
    replace: true,
    templateUrl: path.resolve(appTemplates.roomUsers)
  };
};

angular // eslint-disable-line no-undef
  .module("roomModule")
  .directive("usersRoom", directive);
