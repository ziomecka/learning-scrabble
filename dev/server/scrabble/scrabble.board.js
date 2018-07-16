/* jshint esversion: 6 */
// const Field = require("./scrabble.field");

class Board {
  constructor(options) {
    this.rows = options;
  }

  row (field) {
    return Number(field.match(/\d+$/g)[0]);
  }

  column (field) {
    return Number(field.match(/^\d+/g)[0]);
  }

  isCorrect (num) {
    let size = this.size;
    return (
      Number.isInteger(num) &&
      num >=0 &&
      num < size
    );
  }

  get size () {
    return this.rows.length;
  }

  placeTile (field) {
    let id = field.id;
    let column = this.column(id);
    let row = this.row(id);
    let tile = field._tile;

    if (this.isCorrect(column) && this.isCorrect(row)) {
      this.rows[column][row].tile = tile;
    } else {
      throw Error ("");
    }

    tile = null;
  }

  placeTiles (fields) {
    if (Array.isArray(fields)) {
      fields.forEach(field => {
        this.placeTile(field);
      }, this);
    } else {
      throw Error("Tiles are not array.");
    }
  }

  // createFields() {
  //   let rows = this.rows = [];
  //   for (let i = 0; i < this.size; i++) {
  //     let row = rows[i] = [];
  //     for (let j = 0; j < this.size; j++) {
  //       row[j] = new Field({"row": i, "column": j});
  //     }
  //   }
  //   rows = null;
  // }

  toJSON () {
    return this;
  }
}

module.exports = {
  Board: Board
};
