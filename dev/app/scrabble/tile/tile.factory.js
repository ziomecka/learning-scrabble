/* jshint esversion: 6 */
const tileFactory = (tileOptions, tileStates) => {
  "ngInject";

  class Tile {
    constructor() {
      ({letter: this.letter, points: this.points} = tileOptions);
    }
  }
  return Tile;
};

angular
  .module("tileModule")
  .factory("tileFactory", tileFactory);
