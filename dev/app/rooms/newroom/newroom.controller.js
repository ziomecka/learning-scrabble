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
    this.name = this.newroomDefaults.name;
    this.numberPlaces = this.newroomDefaults.placesOptions[0];
  }

  createRoom (data) {
    this.newroomService.createRoom({
      data: data
    });
  }
};
