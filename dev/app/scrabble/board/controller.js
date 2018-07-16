/* jshint esversion: 6 */
module.exports = class Controller {
  constructor(
    scrabbleBoardService,
    scrabbleStatesService
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleBoardService,
      scrabbleStatesService
    });
  }

  get rows () {
    return this.scrabbleBoardService.rows;
  }

  get gameState () {
    return this.scrabbleStatesService.stateDescription;
  }

  startDragTile (tile) {
    this.scrabbleBoardService.startDragTile(tile);
  }

  endDropTile (tile) {
    this.scrabbleBoardService.endDropTile(tile);
  }

  endDragTile (result) {
    this.scrabbleBoardService.endDragTile(result);
  }
};
