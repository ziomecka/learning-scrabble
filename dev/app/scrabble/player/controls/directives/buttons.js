/* jshint esversion: 6 */
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";

  return {
    restrict: "E",
    replace: true,
    templateUrl: path.resolve(appTemplates.scrabbleControls),
    controller: require("../controller"),
    controllerAs: "scrabbleControlsCtrl"
  };
};

angular // eslint-disable-line no-undef
  .module("scrabbleControlsModule")
  .directive("scrabbleControls", directive);
