/* jshint esversion: 6 */
module.exports = class NavigationController {
  constructor (
    authorizationService
  ) {
    "ngInject";

    Object.assign(this, {
      authorizationService
    });
  }

  logout () {
    this.authorizationService.unauthorize();
  }
};
