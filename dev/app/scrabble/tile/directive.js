/* jshint esversion: 6 */
const path = require("path");

const directive = (
  scrabbleDragAndDropService,
  appTemplates
) => {
  "ngInject";

  const isFunction = object => {
    return typeof object === "function";
  }

  const link = (
    scope,
    element,
    attrs,
    ngModel
  ) => {

    scope.$on("$destroy", () => {
      removeDragAndDropListeners();
      removeClickListeners();
      if (isFunction(observeTile)) {
        observeTile();
      }
      if (isFunction(observeGame)) {
        observeGame();
      }
      addDragAndDropListeners = null;
      removeDragAndDropListeners = null;
      addClickListeners = null;
      removeClickListeners = null;
      observeTileState = null;
      observeTile = null;
      observeGame = null;
      watchedValue = null;
      classes = null;
    });

    let classes = {
      "toBeExchanged": "tile--toBeExchanged",
      "toBePlayed": "tile--onRack",
      "placedOnBoard": "tile--placedOnBoard"
    };

    let toggleClass = className => {
      let classList = element[0].classList;
      if (classList.contains(className)) {
        classList.remove(className);
      } else {
        classList.add(className);
      }
      classList = null;
    };

    let removeClass = options => {
      let {className, el} = options;
      let classList = el.classList;
      if (classList.contains(className)) {
        classList.remove(className);
      }
      classList = null;
      el = null;
    };

    let addDragAndDropListeners = () => {
      scrabbleDragAndDropService.drag.addListeners({
        scope: scope,
        element: element,
        parent: "field",
        data: "tile",
        callbackDragStart: tile => {
          ngModel.$modelValue.startDragTile(tile);
        },
        callbackDragEnd: result => {
          ngModel.$modelValue.endDragTile(result);
        }
      });
    };

    let removeDragAndDropListeners = () => {
      scrabbleDragAndDropService.drag.removeListeners({
        "element": element
      });
    };

    let addClickListeners = callback => {
      element.on("click", e => callback(e));
    };

    let removeClickListeners = () => {
      element.off("click");
      Object.keys(classes).forEach(cls => {
        removeClass({
          className: classes[cls],
          el: element[0]
        });
      });
    };

    /** If tile belongs to Player then
        listen to click events.
        */
    let observeTileState = () => {
      return attrs.$observe("tileState", newval => {
        if (newval === "onRack") {
          removeClickListeners();
          addClickListeners(e => {
            if (ngModel.$name === "rackController") {
              ngModel.$modelValue.select({
                tile: e.target.id,
                state: "isBeingPlayed"
              });
            }
            toggleClass(classes["toBePlayed"]);
            ngModel.$modelValue.startDragTile(e.target.id);
          });
        } else if (newval === "placedOnBoard") {
          removeClickListeners();
          addClickListeners(e => {
            ngModel.$modelValue.startDragTile(e.target.id);
          });
        } else {
          removeClickListeners();
        }
      });
    }

    let observeTile = observeTileState();
    let watchedValue = () => ngModel.$modelValue.gameState;
    let observeGame = scope.$watch(watchedValue, newvalue => {
      if (newvalue === "movePlaceWord") {
        observeTile = observeTileState();
        addDragAndDropListeners();
      } else if (newvalue === "moveExchangeTiles") {
        observeTile();
        removeClickListeners();
        addClickListeners(e => {
          toggleClass("tile--toBeExchanged");
          ngModel.$modelValue.select({
            tile: e.target.id,
            state: "isBeingExchanged"
          });
        });
        removeDragAndDropListeners();
      } else {
        removeDragAndDropListeners();
        if (isFunction(observeTile)) {
          observeTile();
          observeTile = null;
        }
      }
    });
  };

  return {
    restrict: "E",
    templateUrl: path.resolve(appTemplates.scrabbleTile),
    require: "^ngModel",
    replace: true,
    link: link
  };
};

angular // eslint-disable-line no-undef
  .module("scrabbleTileModule")
  .directive("scrabbleTile", directive);
