/* jshint esversion: 6 */
module.exports = class Controller {
  constructor (
    scrabbleRackService,
    scrabbleStatesService
  ) {
    "ngInject";
    Object.assign(this, {
      scrabbleRackService,
      scrabbleStatesService
    });
    this._places = scrabbleRackService.places;
  }

  get gameState () {
    return this.scrabbleStatesService.stateDescription;
  }

  select (options) {
    this.scrabbleRackService.select(options);
  }

  get places () {
    return this._places;
  }

  startDragTile (tile) {
    this.scrabbleRackService.startDragTile(tile);
  }

  endDragTile (result) {
    this.scrabbleRackService.endDragTile(result);
  }

  endDropTile (tile) {
    this.scrabbleRackService.endDropTile(tile);
  }
};
