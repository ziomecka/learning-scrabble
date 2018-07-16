/* jshint esversion: 6 */
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";

  return {
    restrict: "E",
    replace: true,
    templateUrl: path.resolve(appTemplates.roomOptions),
    controller: require("./controller"),
    controllerAs: "roomOptionsCtrl"
  };
};

angular // eslint-disable-line no-undef
  .module("roomModule")
  .directive("optionsRoom", directive);
