/* jshint esversion: 6 */
class Service {
  constructor (
    scrabbleStatesService
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleStatesService
    });
  }

  isFunction (object)  {
    return (typeof object === "function");
  }

  findParent (options) {
    let {scope, parent} = options;
    let p = scope;
    while (p[parent] === undefined) {
      p = p.$parent;
    }
    return p[parent];
  }

  addDragListeners (options) {
    let {
      scope,
      element,
      parent = "field",
      data = "tile",
      callbackDragStart,
      callbackDragEnd
    } = options;

    /** If parent is not an object then find parent. */
    if (Object(parent) !== parent) {
      parent = this.findParent({
        scope: scope,
        parent: parent
      });
    }

    /** Add listeners. */
    element.on("dragstart", e => {
      let dataTransfer = e.dataTransfer;
      dataTransfer.effectAllowed = "move";
      dataTransfer.setData("text/plain", e.target.id);
      if (this.isFunction(callbackDragStart)) {
        callbackDragStart(scope[data]);
      }
      dataTransfer = null;
    });

    element.on("drag", e => {
      e.preventDefault();
    });

    element.on("dragend", e => {
      /** If drag was successful. */
      if (this.isFunction(callbackDragEnd)) {
        if (e.dataTransfer.dropEffect !== "none") {
          callbackDragEnd(true);
        } else {
          callbackDragEnd(false);
        }
      }
    });
  }

  removeDragListeners (options) {
    let {element} = options;
    element.off("dragstart");
    element.off("drag");
    element.off("dragend");
  }

  addDropListeners (options) {
    let {
      scope,
      element,
      parent = "field",
      callbackDrop
    } = options;

    /** If parent is not an object then find parent. */
    if (Object(parent) !== parent) {
      parent = this.findParent({
        "scope": scope,
        "parent": parent
      });
    }

    element.on("drop", e => {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "move";

      try {
        if (this.isFunction(callbackDrop)) {
          callbackDrop({
            "field": parent
            // "tileId": e.dataTransfer.getData("text") // TODO can be removed
          });
        }
      } catch (err) {
        /* eslint-disable no-console */
        if (err.name === "SyntaxError" && this.scrabbleStatesService.isExchangingTiles) {
          console.warn("Tiles cannot be dragged and dropped when exchanging. Please resign.");
        } else {
          console.error("Tile cannot be dropped.");
        }
        /* eslint-enable no-console */
      }
    });

    element.on("dragover", e => {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "move";
    });
  }

  removeDropListeners (options) {
    let {element} = options;
    element.off("drop");
    element.off("dragover");
  }

  get drag () {
    return {
      addListeners: options => this.addDragListeners(options),
      removeListeners: options => this.removeDragListeners(options)
    };
  }

  get drop () {
    return {
      addListeners: options => this.addDropListeners(options),
      removeListeners: options => this.removeDropListeners(options)
    };
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleModule")
  .service("scrabbleDragAndDropService", Service);
