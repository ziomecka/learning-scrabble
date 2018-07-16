/* jshint esversion: 6 */
module.exports = class Controller {
  constructor (
    roomPlayersService,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      roomPlayersService,
      userData
    });
  }

  get newPoints () {
    return this.roomPlayersService.newPoints;
  }

  get seated () {
      return this.roomPlayersService.seated;
      // // let seats = () => {
      // //   this.places.some(place => place.login === this.userData.login);
      // // };
      // return this.$scope.$watch(this.roomPlayersService.seated, newValue => newValue);
  }

  get places () {
    return this.roomPlayersService.places;
  }

  isPlayer (login) {
    return login === this.userData.login;
  }

  sit (placeId) {
    this.roomPlayersService.sit(placeId);
  }
};
