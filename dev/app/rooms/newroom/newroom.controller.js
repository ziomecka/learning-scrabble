/* jshint esversion: 6 */
module.exports = class NewroomController {
  constructor (newroomDefaults, newroomService) {
    "ngInject";
    this.defaults = newroomDefaults;
    this.newroomService = newroomService;

    this.nameUnique = true;
    this.name = "scrabble";
    this.numberPlaces = this.defaults.placesOptions[0];
    this.buttonsDisabled = false;
  }

  createRoom (data) {
    this.newroomService.createRoom({
      data: data,
      callbacks: {
        success: data => data, // TODO not needed
        failure: () => {} //TODO
      }
    });
  }
};
