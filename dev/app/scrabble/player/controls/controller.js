/* jshint esversion: 6 */
module.exports = class ScrabbleConstrolsController {
  constructor (
    scrabbleControlsService,
    $scope,
    $rootScope,
    $timeout
  ) {
    "ngInject";

    Object.assign(this, {
      scrabbleControlsService,
      $scope,
      $rootScope,
      $timeout
    });
  }

  /** Buttons' states */
  get tilesPlacedCorrectly () {
    return this.scrabbleControlsService.tilesPlacedCorrectly;
  }

  /** Game's state */
  get state() {
    return this.scrabbleControlsService.state;
  }

  /** Buttons' clisks */
  placeWord () {
    this.scrabbleControlsService.placeWord();
  }

  letsExchange () {
    this.scrabbleControlsService.letsExchange();
  }

  resignMove () {
    this.scrabbleControlsService.resignMove();
  }

  exchangeTiles () {
    this.scrabbleControlsService.exchangeTiles();
  }

  resignExchange () {
    this.scrabbleControlsService.resignExchange();
  }

  acceptWord ()  {
    this.scrabbleControlsService.acceptsWord();
  }

  verifyWord () {
    this.scrabbleControlsService.verifiesWord();
  }
};
