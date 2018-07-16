/* jshint esversion: 6 */
module.exports = class Controller {
  constructor(
    loginService,
    routerStates,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      loginService,
      routerStates,
      routerGoService
    });
  }

  get buttonText () {
    switch (true) {
      case this.loginService.isFailurelogin:
        return "Incorrect login";
      case this.loginService.isFailurepassword:
        return "Incorrect password";
      default:
        return "Login";
    }
  }

  get isFailurelogin () {
    return this.loginService.isFailurelogin;
  }

  get isFailurepassword () {
    return this.loginService.isFailurepassword;
  }

  get isFailure () {
    return this.isFailurelogin || this.isFailurepassword;
  }

  get isWaiting () {
    return this.loginService.isWaiting;
  }

  get isSuccess () {
    return this.loginService.isSuccess;
  }

  get disabledButtons () {
    return this.isFailure || this.isWaiting;
  }

  goNewuser () {
    this.routerGoService.go({state: this.routerStates.newuser});
  }

  loginUser (data) {
    this.loginService.login(data);
  }
};
