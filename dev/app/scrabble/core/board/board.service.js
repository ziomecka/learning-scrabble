/* jshint esversion: 6 */
class Board {
  constructor(
    fieldFactory,
    tileFactory,
    boardOptions
  ) {
    "ngInject";

    ({size: this.size, bonuses: this.bonuses} = boardOptions);

    this.directions = ["row", "column"];
    this.side = [-1, 1];

    Object.assign(this, {
      fieldFactory,
      tileFactory
    });

    this.rows = this.createFields();
    this.setBonuses();
  }

  getNeighbor(field, direction, side) {
    let row = field.row;
    let column = field.column;
    if (direction === "column") {
      return (row + side >= 0)? this.rows[row + side][column] : null;
    } else if (direction === "row") {
      return (column + side >= 0)? this.rows[row][column - 1] : null;
    } else {
      throw Error("");
    }
  }

  isNeighborOf (tile, tiles) {
    return tiles.some((item) => item.column === tile.column || item.row === tile.row);
  }

  createFields () {
    let result = [];
    for (let i = 0; i < this.size; i++) {
      let row = result[i] = [];
      for (let j = 0; j < this.size; j++) {
        row[j] = new this.fieldFactory({"row": i, "column": j});
      }
    }

    result[0][0].tile = new this.tileFactory({letter: "A", "points": 1});
    result[0][1].tile = new this.tileFactory({letter: "B", "points": 2});
    return result;
  }

  setBonuses() {
    Object.keys(this.bonuses).forEach(type => {
      this.bonuses[type].forEach(bonus => {
        let row = bonus[0] - 1;
        let column = bonus[1] - 1;
        this.rows[row][column].bonus = type;
      });
    });
  }

  placeTile(options) {
    let {tile, field} = options;
    if (tile) {
      this.rows[field.column][field.row].tile = tile;
      tile = null;
      field = null;
    }
  }
}

angular
  .module("boardModule")
  .service("boardService", Board);
