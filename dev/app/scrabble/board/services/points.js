/* jshint esversion: 6 */
class ScrabblePointsService {
  constructor (
    ScrabbleTileFactory
  ) {
    "ngInject";

    Object.assign(this, {
      ScrabbleTileFactory
    });
  }

  isTile (object) {
    return this.ScrabbleTileFactory.Tile.isTile(object);
  }

  getPoints (words) {
    this._points = 0;
    if (Array.isArray(words)) {
      words.forEach(word => {
        this._points += this._calculateWord(word);
      });
      return this._points;
    } else {
      throw new Error ("");
    }
  }

  _bonusTimes (txt) {
    return Number(txt.match(/\d+$/g)[0]);
  }

  _bonusType (txt) {
    return txt.match(/^[_a-zA-Z]+/g)[0];
  }

  _calculateWord (word) {
    if (Array.isArray(word)) {
      let points = 0;
      let bonus;
      let letterBonus;
      let wordBonus = 1;

      word.forEach(field => {
        letterBonus = 1;
        let tile = field.tile;
        if (this.isTile(tile)) {
          /** Calculate bonus only for newly placed tiles */
          if (tile.isPlacedOnBoard) {
            bonus = field.bonus;
          } else {
            bonus = undefined;
          }

          if (bonus && this._bonusType(bonus) === "letter") {
            letterBonus = this._bonusTimes(bonus);
          } else if (bonus && this._bonusType(bonus) === "word") {
            wordBonus *= this._bonusTimes(bonus);
          }

          points += Number(tile.points) * letterBonus;
        }

          tile = null;
      }, this);

      return points * wordBonus;
    } else {
      throw new Error ("Points not calculated.");
    }
  }
}

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .service("scrabblePointsService", ScrabblePointsService);
