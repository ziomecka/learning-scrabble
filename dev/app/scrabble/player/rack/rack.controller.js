/* jshint esversion: 6 */
module.exports = class RackController {
  constructor (rackService) {
    "ngInject";
    this._places = rackService.places;
  }
  get places () {
    return this._places;
  }
};
