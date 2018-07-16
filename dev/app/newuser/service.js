/* jshint esversion: 6 */
class Service {
  constructor(
    newuserSocket,
    authorizationService,
    manageStatesService,
    authorizationCookiesService,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      newuserSocket,
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

  get isFailureother () {
    return this.manageStatesService.isFailureother;
  }

  get isFailurenotunique () {
    return this.manageStatesService.isFailurenotunique;
  }

  get isSuccess () {
    return this.manageStatesService.isFailuresuccess;
  }

  createUser (data) {
    let statesService = this.manageStatesService;
    statesService.isWaiting = true;
    this.authorizationCookiesService.listenSetAuthorizationCookies();
    this.newuserSocket.createUser({
      "data": data,
      "callbacks": {
        "success": data => {
          statesService.setTemporaryState({"state": "success"});
          this.authorizationService.authorize(data);
          statesService = null;
          this.routerGoService.go();
        },
        "failureNotUnique": () => {
          statesService.setTemporaryState({"state": "failureNotUnique"});
          statesService = null;
        },
        "failureOther": () => {
          statesService.setTemporaryState({"state": "failureOther"});
          statesService = null;
        }
      }
    });
  }
}

angular // eslint-disable-line no-undef
  .module("newuserModule")
  .service("newuserService", Service);
