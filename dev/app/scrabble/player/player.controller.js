/* jshint esversion: 6 */
module.exports = class PlayerController {
  constructor (playerFactory) {
    "ngInject";
    ({name: this.name, tiles: this.tiles, time: this.time, points: this.points} = playerFactory);
  }
};
