/* jshint esversion: 6 */
const path = require("path");
const fieldDirective = (
  scrabbleDragAndDropService,
  ScrabbleTileFactory,
  appTemplates
) => {
  "ngInject";

  const link = (
    scope,
    element,
    attrs,
    ngModel
  ) => {

    let isFunction = object => {
      return typeof object === "function";
    }

    scope.$on("$destroy", () => {
      removeListeners();
      if (isFunction(observeGameState)) {
        observeGameState();
      }
      if (isFunction(observeField)) {
        observeField();
      }
      isFunction = null;
      addListeners = null;
      removeListeners = null
      observeGameState = null;
      observeField = null;
    });

    let callbackDrop = options => {
      let {
        methodName
      } = options;
      return tile => {
       let model = ngModel.$modelValue;
       if (model && Object.getPrototypeOf(model).hasOwnProperty(methodName)) {
         ngModel.$modelValue[methodName](tile);
       }
       model = null;
     };
   };

    let addListeners = () => {
      scrabbleDragAndDropService.drop.addListeners({
        "scope": scope,
        "element": element,
        "parent": "field",
        "data": "tile",
        "callbackDrop": tile => callbackDrop({
          methodName: "endDropTile"
        })(tile)
      });

      scrabbleDragAndDropService.drag.addListeners({
        "scope": scope,
        "element": element,
        "parent": "field",
        "data": "tile"
      });
    };

    let addClickListeners = callback => {
      element.on("click", e => callback(e));
    };

    let removeClickListeners = () => {
      element.off("click");
    };

    let removeListeners = () => {
      scrabbleDragAndDropService.drop.removeListeners({
        "element": element
      });
    };

    let observeFieldState = () => {
      return scope.$watch("tile", newval => {
        /** If field has no tile add drag&drop events listeners.
            Else: remove drag&drop listeners.
            */
        if (newval === null || newval === undefined) {
          addListeners();
          addClickListeners(() => {
            let findParent = property => {
              let p = scope;
              while (p[property] === undefined) {
                p = p.$parent;
              }
              return p[property];
            }

            ngModel.$modelValue.endDropTile({"field": findParent("field")});
          });
        } else {
          removeListeners();
          removeClickListeners();
        }
      });
    }
    /** If player is placing word, then add drag&drop events listeners
        Else remove listeners.
        */
    let observeField;
    let observeGameState = scope.$watch(() => ngModel.$modelValue.gameState, newvalue => {
      if (newvalue === "movePlaceWord") {
        observeField = observeFieldState();
      } else {
        if (isFunction(observeField)) {
          observeField();
          observeField = null;
        }
        removeListeners();
      }
    });
  };

  return {
    restrict: "E",
    templateUrl: path.resolve(appTemplates.scrabbleField),
    replace: true,
    require: "^ngModel",
    transclude: {
      "scrabbleTile": "?scrabbleTile"
    },
    link: link,
    scope: {
      field: "=field",
      tile: "=tile"
    }
  };
};

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .directive("scrabbleField", fieldDirective);
