/* jshint esversion: 6 */
const fieldDirective = () => {
  const link = (scope, element, attrs) => {
    const read = tile => {
      scope.fieldInfo.tile = JSON.parse(tile);
    };

    const addListeners = (element) => {
      element.on("drop", e => {
        e.preventDefault();
        scope.$apply(() => {
          read(e.originalEvent.dataTransfer.getData("tile"));
        });
      });

      element.on("dragover", e => {
        e.preventDefault();
      });
    };

    const removeListeners = element => {
      element.off("drop");
      element.off("dragover");
    };

    /** If field is droppable add drag&drop event listeners.
        Else: remove drag&drop listeners.
        Field is droppable if field.tile === null (set in fieldFactory).
        */
    attrs.$observe("fieldDroppable", newvalue => {
      if (newvalue === "true") {
        addListeners(element);
      } else {
        removeListeners(element);
      }
    });
  };

  return {
    restrict: "E",
    templateUrl: "scrabble.field.html",
    link: link,
    scope: {
      fieldInfo: "=field",
      tileInfo: "=tile"
    }
  };
};

angular
  .module("boardModule")
  .directive("scrabbleField", fieldDirective);
