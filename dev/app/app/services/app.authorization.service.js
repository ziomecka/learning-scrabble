/* jshint esversion: 6 */
class AuthorizationService {
  constructor (
    $state,
    routerStates,
    cookiesService,
    userData,
    routerGoService
  ) {
    "ngInject";

    Object.assign(this, {
      $state,
      routerStates,
      cookiesService,
      userData,
      routerGoService
    });
  }

  clear () {
    this.userData.authorized = false;
    this.$state.go(this.routerStates.authorization);
  }

  /** Store login in authorization service. */
  authorize (data) {
    ({
      authorized: this.userData.authorized = true,
      login: this.userData.login = ""
    } = data);
    this.routerGoService.go();
  }

  unauthorize () {
    this.userData.authorized = false;
    this.userData.login = "";
    // TODO change name of the below service
    /** Destroy cookies */
    this.cookiesService.removeAuthorizationCookies();
    // TODO off all or some sockets???
    /** Go back to authorization state */
    this.routerGoService.go({state: this.routerStates.authorization});
  }
}

angular
  .module("app")
  .service("authorizationService", AuthorizationService);
