/* jshint esversion: 6 */
class AuthorizationService {
  constructor (
    routerStates,
    authorizationCookiesService,
    userData,
    routerGoService,
    socketFactory
  ) {
    "ngInject";

    Object.assign(this, {
      routerStates,
      authorizationCookiesService,
      userData,
      routerGoService,
      socketFactory
    });
  }

  clear () {
    this.userData.authorized = false;
    this.userData.login = undefined;
    /** Go back to authorization state */
    this.routerGoService.go({state: this.routerStates.login});
  }

  authorize (data) {
    /** Store authorized and login in user data. */
    ({
      authorized: this.userData.authorized = true,
      login: this.userData.login
    } = data);
    // this.routerGoService.go();
  }

  unauthorize () {
    /** Destroy cookies */
    this.authorizationCookiesService.removeAuthorizationCookies();
    /** Remove all listeners. */
    this.socketFactory.off();
    this.clear();
  }
}

angular // eslint-disable-line no-undef
  .module("app")
  .service("authorizationService", AuthorizationService);
