/* jshint esversion: 6 */
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";
  return {
    restrict: "E",
    replace: true,
    transclude: {
      "scrabbleControls": "?scrabbleControls"
    },
    templateUrl: path.resolve(appTemplates.roomControls),
    controller: require("./controller"),
    controllerAs: "roomControlsCtrl"
  };
};

angular // eslint-disable-line no-undef
  .module("roomModule")
  .directive("controlsRoom", directive);
