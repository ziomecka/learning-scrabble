let Bag = require("./bag");
let Board = require("./board");

module.exports = class Scrabble {
  constructor (options) {
    this.bag = new Bag(options.bag);
    this.board = new Board(options.board);
  }
  toJSON () {
    return {
      bag: this.bag,
      board: this.board
    }
  }
};
