/* jshint esversion: 6 */
// TODO not needed???
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";
  return {
    restrict: "E",
    replace: true,
    transclude: true,
    templateUrl: path.resolve(appTemplates.scrabblePlayer),
    controller: require("./controller"),
    controllerAs: "playerCtrl"
  };
};

angular // eslint-disable-line no-undef
  .module("scrabblePlayerModule")
  .directive("scrabblePlayer", directive);
