/* jshint esversion: 6 */
import bags from "./assets/bags.json";

class Bag {
  constructor (options) {
    if (Array.isArray(options)) {
      this.tiles = options;
    } else {
      ({lang: this.lang = "Polish"} = Object(options));
      this.tiles = bags[this.lang];
    }
  }

  exchangeTiles (data) {
    return this.draw().add();
  }

  add (tile) {
    this.tiles.push(tile);
  }

  get numberTiles () {
    return this.tiles.length;
  }

  draw () {
    // console.log("bag draws tile");
    let index = Math.floor(Math.random() * this.numberTiles);
    return this.tiles.splice(index, 1)[0];
  }

  toJSON () {
    return {
      tiles: this.tiles
    }
  }
}

module.exports = {
  Bag: Bag
};
