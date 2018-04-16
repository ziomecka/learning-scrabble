/* jshint esversion: 6 */
module.exports = class AuthorizationController {
  constructor(authorizationLoginService, routerStates, routerGoService) {
    "ngInject";

    this.routerGoService = routerGoService;
    this.authorizationLoginService = authorizationLoginService;
    this.routerStates = routerStates;
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
