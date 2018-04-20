/* jshint esversion: 6 */
module.exports = class AuthorizationController {
  constructor(
    authorizationLoginService,
    routerStates,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      authorizationLoginService,
      routerStates,
      routerGoService
    });
  }

  get isWaiting () {
    return this.authorizationLoginService.isWaiting;
  }

  get isFailureLogin () {
    return this.authorizationLoginService.isFailureLogin;
  }

  get isFailurePassword () {
    return this.authorizationLoginService.isFailurePassword;
  }

  goNewuser () {
    this.routerGoService.go({state: this.routerStates.newuser});
  }

  loginUser (data) {
    this.authorizationLoginService.login(data);
  }
};
