/* jshint esversion: 6 */
const path = require("path");
const directive = (
  appTemplates
) => {
  "ngInject";
  // const link = (scope, element, attrs, ngModel, transclude) => {
  //   // transclude(clone => element.append(clone));
  //   element.append(transclude());
  // };

  return {
    restrict: "E",
    // link: link,
    // transclude: true,
    replace: true,
    templateUrl: path.resolve(appTemplates.roomPlayers),
    controller: require("./controller"),
    controllerAs: "roomPlayersCtrl"
  };
};

angular // eslint-disable-line no-undef
  .module("roomModule")
  .directive("playersRoom", directive);
