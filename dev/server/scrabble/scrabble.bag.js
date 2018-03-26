/* jshint esversion: 6 */
import Tile from "./tile.class";
import lettersPoints from "./letters/letters.points.json";
import lettersNumber from "./letters/letters.number.json";
import pointsTable from "./letters/points.json";
import findkey from "lodash/findkey";

export default class Bag {
  constructor (options) {
    options = Object(options);
    let {lang: lang = "Polish", game: game = null} = options;
    this.tiles = [];
    let letters = lettersNumber[lang];
    let table = pointsTable[lang];
    this.game = game;

    Object.keys(letters).forEach(letter => {
      let level = findkey(lettersPoints[lang], arr => arr.includes(letter));
      let points = table[level];
      for(let i = 0, len = letters[letter]; i < len; i++) {
        this.tiles.push(new Tile({bag: this, letter: {letter: letter, points: points}}));
      }
    });

    table = null;
    letters = null;
  }

  add (tile) {
    tile.owner = this;
    this.push(tile);
  }

  draw (player) {
    let index = Math.floor(Math.random() * this.tiles.length);
    player.getsTile(this.tiles.splice(index, 1)[0]);
  }
}
