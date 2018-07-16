/* jshint esversion: 6 */
class Service {
  constructor(
    loginSocket,
    authorizationService,
    manageStatesService,
    authorizationCookiesService,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      loginSocket,
      authorizationService,
      manageStatesService,
      authorizationCookiesService,
      routerGoService
    });

    this.manageStatesService.isIdle = true;
  }

  get isWaiting () {
    return this.manageStatesService.isWaiting;
  }

  get isFailurelogin () {
    return this.manageStatesService.isFailurelogin;
  }

  get isFailurepassword () {
    return this.manageStatesService.isFailurepassword;
  }

  get isSuccess () {
    return this.manageStatesService.isFailuresuccess;
  }

  login (data) {
    let statesService = this.manageStatesService;
    statesService.isWaiting = true;
    this.authorizationCookiesService.listenSetAuthorizationCookies();
    this.loginSocket.login({
      data: data,
      callbacks: {
        success: data => {
          statesService.setTemporaryState({"state": "success"});
          statesService = null;
          this.authorizationService.authorize(data);
          this.routerGoService.go();
        },
        failureLogin: () => {
          statesService.setTemporaryState({"state": "failureLogin"});
          statesService = null;
        },
        failurePassword: () => {
          statesService.setTemporaryState({"state": "failurePassword"});
          statesService = null;
        },
        failureOther: () => {
          statesService.setTemporaryState({"state": "failureOther"});
          statesService = null;
        }
      }
    });
  }
}

angular // eslint-disable-line no-undef
  .module("loginModule")
  .service("loginService", Service);
