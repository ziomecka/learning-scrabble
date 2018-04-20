/* jshint esversion: 6 */
const fieldDirective = (dragAndDropService) => {
  "ngInject";
  const link = (scope, element, attrs) => {
    const addListeners = () => {
      dragAndDropService.drop.addListeners({
        scope: scope,
        element: element,
        parent: "fieldInfo",
        data: "tile"
      });
    };

    const removeListeners = () => {
      dragAndDropService.drop.removeListeners({
        element: element
      });
    };

    /** If field is droppable add drag&drop event listeners.
        Else: remove drag&drop listeners.
        Field is droppable if field.tile === null (set in fieldFactory).
        */
    attrs.$observe("fieldDroppable", newvalue => {
      if (newvalue === "true") {
        addListeners();
      } else {
        removeListeners();
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
