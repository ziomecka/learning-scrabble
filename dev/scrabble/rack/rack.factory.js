/* jshint esversion: 6 */
angular
.module("rackModule")
.factory("rackFactory", () => {
  class Rack {
    constructor () {
      this.places = new Array(7);
    }

    getsTile (tile) {
      let index = this.places.findIndex((element) => element === undefined);
      this.places[index] = tile;
    }
  }
  return Rack;
});
