/* jshint esversion: 6 */
module.exports = class NavigationController {
  constructor (
    authorizationService,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      authorizationService,
      userData
    });
  }

  logout () {
    this.authorizationService.unauthorize();
  }
};
