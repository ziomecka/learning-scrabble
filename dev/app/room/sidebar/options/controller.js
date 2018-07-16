/* jshint esversion: 6 */
module.exports = class Controller {
  constructor (
    roomOptionsService,
    newroomDefaults
  ) {
    "ngInject";

    Object.assign(this, {
      roomOptionsService,
      newroomDefaults
    });

    ({placesOptions: this.placesOptions, timeOptions: this.timeOptions} = this.newroomDefaults);
  }

  get time () {
    return this.roomOptionsService.time;
  }

  set time (time) {
    this.roomOptionsService.time = time;
  }

  get numberPlaces () {
    return this.roomOptionsService.numberPlaces;
  }

  set numberPlaces (number) {
    this.roomOptionsService.numberPlaces = number;
  }
};
