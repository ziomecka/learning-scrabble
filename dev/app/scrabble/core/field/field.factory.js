/* jshint esversion: 6 */
const fieldFactory = () => {
  "ngInject";
  class Field {
    constructor(options) {
      ({row: this.row, column: this.column, drawOptions: this.drawOptions} = options);
      this._tile = null;
      this.bonus = "none";
      this._droppable = true;
    }

    get droppable () {
      return this._droppable;
    }

    set tile (tile) {
      this._tile = tile;
      this._droppable = tile? false : true;
    }
    get tile () {
      return this._tile;
    }
    set droppable (boolean) {
      this._droppable = boolean;
    }

    put (tile) {
      this.tile = tile;
    }

    remove () {
      this.tile = null;
    }
  }

  return Field;
};

angular
  .module("boardModule")
  .factory("fieldFactory", fieldFactory);
