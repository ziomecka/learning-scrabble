/* jshint esversion: 6 */
const tileFactory = () => {
  "ngInject";

  class Tile {
    constructor(tileOptions) {
      ({letter: this.letter, points: this.points} = tileOptions);
      this._draggable = true;
    }

    get draggable () {
      return this._draggable;
    }

    set draggable (boolean) {
      this._draggable = boolean;
    }

  }
  return Tile;
};

angular
  .module("tileModule")
  .factory("tileFactory", tileFactory);
