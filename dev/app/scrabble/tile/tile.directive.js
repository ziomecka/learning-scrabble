/* jshint esversion: 6 */

// TODO - improve so it works for scrabble rack as well
const ScrabbleTileDirective = () => {
  "ngInject";
  const link = (scope, element, attrs) => {
    const addListeners = element => {
      element.on("dragstart", e => {
        e.originalEvent.dataTransfer.setData("tile", JSON.stringify(scope.tile));
      });
      element.on("drag", e => {
        e.preventDefault();
      });
      element.on("dragend", e => {
        /** If drag was successful remove the tile from field. */
        if (e.originalEvent.dataTransfer.dropEffect != "none") {
          // TODO change to more flexible
          scope.$apply(() => scope.$parent.$parent.fieldInfo.tile = null);
        }
      });
    };

    addListeners(element);
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
