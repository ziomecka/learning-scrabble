/* jshint esversion: 6 */
const path = require("path");
module.exports = (
  appTemplates
) => {
  "ngInject";
  return {
    templateUrl: path.resolve(appTemplates.scrabble),
    controller: require("../controller"),
    controllerAs: "scrabbleCtrl"
  };
};
