/* jshint esversion: 6 */
module.exports = class NewroomController {
  constructor (
    newroomDefaults,
    newroomService
  ) {
    "ngInject";

    Object.assign(this, {
      newroomDefaults,
      newroomService
    });

    this.nameUnique = true; // TODO
    this.name = "scrabble";
    this.numberPlaces = this.newroomDefaults.placesOptions[0];
    this.buttonsDisabled = false; // TODO
  }

  createRoom (data) {
    this.newroomService.createRoom({
      data: data,
      failure: () => {} //TODO
    });
  }
};
