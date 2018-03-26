/* jshint esversion: 6 */
module.exports = class Rack {
  constructor () {
    this.places = new Array(7);
  }

  getsTile (tile) {
    let index = this.places.findIndex((element) => element === undefined);
    this.places[index] = tile;
  }
};
