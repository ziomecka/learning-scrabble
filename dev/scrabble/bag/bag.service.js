/* jshint esversion: 6 */
angular
.module("bagModule")
.service([
  "bagOptions",
  "lettersNumber",
  "lettersPoints",
  "tileFactory",
  function(bagOptions, lettersNumber, lettersPoints, tileFactory) {
    ({lang: this.lang = "Polish", game: this.game = null} = bagOptions);
    this.tiles = [];
    let letters = lettersNumber[this.lang];
    let points = lettersPoints[this.lang];

    Object.keys(letters).forEach(letter => {
      let level = findkey(lettersPoints[lang], arr => arr.includes(letter));
      for(let i = 0, len = letters[letter]; i < len; i++) {
        this.tiles.push(new tileFactory({
          bag: this,
          letter: {letter: letter, points: points[level]}
        }));
      }
    });

    this.add = (tile) => {
      tile.owner = this;
      this.push(tile);
    };

    this.draw = (player) => {
      let index = Math.floor(Math.random() * this.tiles.length);
      player.getsTile(this.tiles.splice(index, 1)[0]);
    };

    letters = null;
    points = null;
  }
]);
