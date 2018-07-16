/* jshint esversion: 6 */
const path = require("path");
/** Just function, because this directive is loaded dynamically in
    resolve.load.room.module.js.
    */
module.exports = (
  appTemplates
) => {
  "ngInject";
  return {
    restrict: "E",
    transclude: {
      // "scrabbleControls": "?scrabbleControls",
      "scrabblePlayer": "?scrabblePlayer"
    },
    replace: true,
    templateUrl: path.resolve(appTemplates.scrabbleSidebar)
  };
};
