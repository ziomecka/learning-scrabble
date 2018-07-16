/* jshint esversion: 6 */
module.exports = class Controller {
  constructor (
    newuserService,
    routerStates,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      newuserService,
      routerStates,
      routerGoService
    });

    this.login = "";
    this.password = "";
    this.loginNotUnique = false;
  }

  get buttonText () {
    switch (true) {
      case this.newuserService.isFailureother:
        return "Error";
      default:
        return "Create user";
    }
  }

  get isFailureother () {
    return this.newuserService.isFailureother;
  }

  get isFailurenotunique () {
    return this.newuserService.isFailurenotunique;
  }

  get isFailure () {
    return this.isFailurenotunique || this.isFailureother;
  }

  get isWaiting () {
    return this.newuserService.isWaiting;
  }

  get isSuccess () {
    return this.newuserService.isSuccess;
  }

  get disabledButtons () {
    return this.isFailure || this.isWaiting;
  }

  goAuthorization () {
    this.routerGoService.go({state: this.routerStates.login});
  }

  createUser (data) {
    this.newuserService.createUser(data);
  }
};
