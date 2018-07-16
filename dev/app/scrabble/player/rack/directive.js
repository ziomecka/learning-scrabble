/* jshint esversion: 6 */
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";

  const link = () => {
  };

  return {
    restrict: "E",
    link: link,
    replace: true,
    controller: require("./controller"),
    controllerAs: "rackCtrl",
    templateUrl: path.resolve(appTemplates.scrabbleRack)
  };
};

angular // eslint-disable-line no-undef
  .module("scrabbleRackModule")
  .directive("scrabbleRack", directive);
