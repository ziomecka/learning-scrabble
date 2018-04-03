/* jshint esversion: 6 */
angular
.module("authorizationModule")
.service("authorizationService", [
  "$state",
  "authorizationStates",
  "authorizationCookiesService",
  function ($state, authorizationStates, authorizationCookiesService) {
    this.authorized = false;
    this.guest = false;
    this.login = "";
    this.lastTo = "";

    this.clear = () => {
      this.authorized = false;
      $state.go(authorizationStates.authorization);
    };

    this.authorize = data => {
      ({
        authorized: this.authorized = true,
        guest: this.guest = false,
        login:  this.login = ""
      } = data);
    };

    this.unauthorize = () => {
      this.authorized = false;
      this.login = "";
      // TODO change name of the below service
      /** Destroy cookies */
      authorizationCookiesService.removeAuthorizationCookies();
      /** Go back to authorization state */
      this.go({state: authorizationStates.authorization});
    };

    // TODO some bullshit when trying to enter room that does not exist
    this.go = data => {
      data = Object(data);
      let {state: state = this.authorized? authorizationStates.rooms: authorizationStates.home, roomId: roomId = ""} = data;
      $state.go(state, {"roomId": roomId});
    };
  }]
);
