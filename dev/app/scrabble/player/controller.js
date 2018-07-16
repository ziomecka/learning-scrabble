/* jshint esversion: 6 */
module.exports = class PlayerController {
  constructor (
    scrabblePlayerService
  ) {
    "ngInject";
    ({
      login: this.login,
      tiles: this.tiles,
      time: this.time,
      points: this.points
    } = scrabblePlayerService);
  }
};
