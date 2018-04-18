/* jshint esversion: 6 */
module.exports = class BoardController {
  constructor(boardService) {
    "ngInject";
    this.rows = boardService.rows;
  }
};
