/* jshint esversion: 6 */
class DragAndDropService {
  constructor () {
    /** Find parent. */
    const findParent = options => {
      let {scope, parent} = options;
      let p = scope;
      while (p[parent] === undefined) {
        p = p.$parent;
      }
      return p[parent];
    };

    const addDragListeners = options => {
      let {scope, element, parent = "fieldInfo", data = "tile"} = options;
      /** If parent is not an object then find parent. */
      if (Object(parent) !== parent) {
        parent = findParent({
          scope: scope,
          parent: parent
        });
      }

      /** add listeners */
      element.on("dragstart", e => {
        e.originalEvent.dataTransfer.setData(data, JSON.stringify(scope[data]));
      });
      element.on("drag", e => {
        e.preventDefault();
      });
      element.on("dragend", e => {
        /** If drag was successful remove the element from parent. */
        if (e.originalEvent.dataTransfer.dropEffect != "none") {
          scope.$apply(() => parent[data] = null);
        }
      });
    };

    const removeDragListeners = options => {
    };

    const addDropListeners = options => {
      let {scope, element, parent = "fieldInfo", data = "tile"} = options;
      /** If parent is not an object then find parent. */
      if (Object(parent) !== parent) {
        parent = findParent({
          scope: scope,
          parent: parent
        });
      }
      element.on("drop", e => {
        e.preventDefault();
        scope.$apply(() => {
            parent[data] = JSON.parse(e.originalEvent.dataTransfer.getData(data));
        });
      });

      element.on("dragover", e => {
        e.preventDefault();
      });
    };

    const removeDropListeners = options => {
      let {element} = options;
      element.off("drop");
      element.off("dragover");
    };

    this.drag = {
      addListeners: addDragListeners,
      removeListeners: removeDragListeners
    };

    this.drop = {
      addListeners: addDropListeners,
      removeListeners: removeDropListeners
    };
  }
}

angular
  .module("scrabbleModule")
  .service("dragAndDropService", DragAndDropService);
