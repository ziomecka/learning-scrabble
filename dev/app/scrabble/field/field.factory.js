/* jshint esversion: 6 */
angular
.module("boardModule")
.factory("fieldFactory", () => {

  class Field {
    constructor(options) {
      ({row: this.row, column: this.column, drawOptions: this.drawOptions} = options);
      this.row = String(this.row);
      this.tile = null;
      this.bonus = "none";
    }

    put (tile) {
      this.tile = tile;
    }

    remove () {
      this.tile = null;
    }
  }

  return Field;
});
