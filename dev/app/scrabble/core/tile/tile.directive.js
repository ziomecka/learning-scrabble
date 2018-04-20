/* jshint esversion: 6 */

// TODO - improve so it works for scrabble rack as well
const ScrabbleTileDirective = (dragAndDropService) => {
  "ngInject";
  const link = (scope, element, attrs) => {

    const addListeners = () => {
      dragAndDropService.drag.addListeners({
        scope: scope,
        element: element,
        parent: "fieldInfo",
        data: "tile"
      });
    };

    const removeListeners = () => {
      dragAndDropService.drag.removeListeners({
        element: element
      });
    };

    attrs.$observe("draggable", newvalue => {
      if (newvalue === "true") {
        addListeners();
      } else {
        removeListeners();
      }
    });
  };

  return {
    restrict: "E",
    templateUrl: "../scrabble.tile.html",
    scope: {
      tile: "=tile",
      field: "=field"
    },
    link: link
  };
};

angular
  .module("tileModule")
  .directive("scrabbleTile", ScrabbleTileDirective);
