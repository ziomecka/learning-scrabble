/* jshint esversion: 6 */
class Board {
  constructor(options) {
    return createFields();
  }

  placeTile(options) {
    let {tile, field} = options;
    this[field.column][field.row].tile = tile;
  }

  createFields() {
    let result = [];
    for (let i = 0; i < size; i++) {
      let row = result[i] = [];
      for (let j = 0; j < size; j++) {
        row[j] = new Field({"row": i, "column": j});
      }
    }
    return result;
  }
}

module.exports = {
  Board: Board
};
