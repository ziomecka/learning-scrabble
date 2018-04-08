/* jshint esversion: 6 */
import bags from "./assets/bags.json";

class Bag {
  constructor (options) {
    options = Object(options);
    ({lang: this.lang = "Polish"} = options);
    this.tiles = bags[this.lang];
  }

  add (tile) {
    this.tiles.push(tile);
  }

  draw (player) {
    let index = Math.floor(Math.random() * this.tiles.length);
    player.getsTile(this.tiles.splice(index, 1)[0]);
  }
}

module.exports = {
  Bag: Bag,
};
