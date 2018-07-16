/* jshint esversion: 6 */
const path = require("path");
/** Just function, because this directive is loaded dynamically in
    resolve.load.room.module.js.
    */
const directive = (
  appTemplates
) => {
  "ngInject";
  return {
    restrict: "E",
    // transclude: true,
    transclude: {
      "scrabbleField": "?scrabbleField"
      // "scrabbleTile": "?scrabbleTile"
    },
    templateUrl: path.resolve(appTemplates.scrabbleBoard),
    controller: require("../controller"),
    controllerAs: "boardCtrl"
  };
};

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .directive("scrabbleBoard", directive);
