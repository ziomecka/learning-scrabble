/* jshint esversion: 6 */
angular
.module("boardModule")
.service("boardService", ["fieldFactory", "boardOptions", function (fieldFactory, boardOptions) {
  let {size: size, bonuses: bonuses} = boardOptions;

  this.fields = new Array(size).fill(new Array(size));

  this.directions = ["row", "column"];
  this.side = [-1, 1];


  this.getNeighbor = (field, direction, side) => {
    let row = field.row;
    let column = field.column;
    if (direction === "column") {
      return (row + side >= 0)? this.fields[row + side][column] : null;
    } else if (direction === "row") {
      return (column + side >= 0)? this.fields[row][column - 1] : null;
    } else {
      throw Error("");
    }
  };

  this.isNeighborOf = (tile, tiles) => {
    return tiles.some((item) => item.column === tile.column || item.row === tile.row);
  };

  this.createFields = () => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        this.fields[i][j] = new fieldFactory({row: i, column: j});
        // column = field;
      }
    }
  };

  this.setBonuses = () => {
    Object.keys(bonuses).forEach(bonus => {
      bonuses[bonus].forEach(field => {
        this.fields[field[0] - 1][field[1] - 1].bonus = bonus;
      });
    });
  };

  this.createFields();
  this.setBonuses();
}]);
