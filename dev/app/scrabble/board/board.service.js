/* jshint esversion: 6 */
class Board {
  constructor(fieldFactory, boardOptions) {
    "ngInject";
    let {size: size, bonuses: bonuses} = boardOptions;

    this.directions = ["row", "column"];
    this.side = [-1, 1];



    this.fields = this.createFields();
    this.setBonuses();
  }

  getNeighbor(field, direction, side) {
    let row = field.row;
    let column = field.column;
    if (direction === "column") {
      return (row + side >= 0)? this.fields[row + side][column] : null;
    } else if (direction === "row") {
      return (column + side >= 0)? this.fields[row][column - 1] : null;
    } else {
      throw Error("");
    }
  }

  isNeighborOf (tile, tiles) {
    return tiles.some((item) => item.column === tile.column || item.row === tile.row);
  }

  createFields () {
    let result = [];
    for (let i = 0; i < size; i++) {
      let row = result[i] = [];
      for (let j = 0; j < size; j++) {
        row[j] = new fieldFactory({"row": i, "column": j});
      }
    }
    return result;
  }

  setBonuses() {
    Object.keys(bonuses).forEach(type => {
      bonuses[type].forEach(bonus => {
        let row = bonus[0] - 1;
        let column = bonus[1] - 1;
        this.fields[row][column].bonus = type;
      });
    });
  }
}

angular.module("boardModule", Board);
