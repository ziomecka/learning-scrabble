/* jshint esversion: 6 */
module.exports = class Controller {
  constructor (
    newroomDefaults,
    newroomService
  ) {
    "ngInject";

    Object.assign(this, {
      newroomService
    });

    this.name = newroomDefaults.name;
    this.placesOptions = newroomDefaults.placesOptions;
    this.numberPlaces = this.placesOptions[0];
  }

  get isWaiting () {
    return this.newroomService.isWaiting;
  }

  get isFailure () {
    return this.newroomService.isFailureOther;
  }

  get isSuccess () {
    return this.newroomService.isSuccess;
  }

  get disabledButtons () {
    return this.isFailure || this.isWaiting;
  }

  createRoom (data) {
    this.newroomService.createRoom({
      "data": data
    });
  }
};
