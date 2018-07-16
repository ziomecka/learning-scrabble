// http://jasonwatmore.com/post/2016/07/13/angularjs-custom-modal-example-tutorial
/* jshint esversion: 6 */
const path = require("path");

const directive = (
  modalsFactory,
  appTemplates
) => {
  "ngInject";
  return {
    restrict: "E",
    templateUrl: path.resolve(appTemplates.modals),
    link: (scope, element, attrs) => {

      /** Modal should have an id */
      if (!attrs.id) return;

      modalsFactory.add({
        id: attrs.id,
        close: () => {
          // element.hide();
        },
        open: (message) => {
          element.val = message;
          // element.show();
        }
      });

      element.hide();

      scope.$on("$destroy", () => {
        modalsFactory.remove(attrs.id);
      });
    }
  };
};

angular // eslint-disable-line no-undef
  .module("modalsModule")
  .directive("modal", directive);
