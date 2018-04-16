/* jshint esversion: 6 */
angular
.module("app")
.service("authorizationService",
  function ($state, routerStates, cookiesService, userData, routerGoService) {
    "ngInject";
    this.clear = () => {
      userData.authorized = false;
      $state.go(routerStates.authorization);
    };

    /** Store login in authorization service. */
    this.authorize = data => {
      ({
        authorized: userData.authorized = true,
        login:  userData.login = ""
      } = data);
      routerGoService.go();
    };

    this.unauthorize = () => {
      userData.authorized = false;
      userData.login = "";
      // TODO change name of the below service
      /** Destroy cookies */
      cookiesService.removeAuthorizationCookies();
      // TODO off all or some sockets???
      /** Go back to authorization state */
      routerGoService.go({state: routerStates.authorization});
    };
  }
);
