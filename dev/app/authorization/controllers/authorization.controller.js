/* jshint esversion: 6 */
module.exports = class AuthorizationController {
  constructor(authorizationLoginService, routerStates, routerGoService) {
    "ngInject";

    this.routerGoService = routerGoService;
    this.authorizationLoginService = authorizationLoginService;
    this.routerStates = routerStates;

    // me.loginData = authorizationLoginService.data;
    // me.$watch("loginState", newValue => {
    //   me.loginState = newValue;
    // }, true);
  }

  goNewuser () {
    this.routerGoService.go({state: this.routerStates.newuser});
  }

  loginUser (data) {
    this.authorizationLoginService.login(data);
  }
};
