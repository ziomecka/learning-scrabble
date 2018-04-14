/* jshint esversion: 6 */
angular
.module("authorizationModule")
.service("authorizationService", [
  "$state",
  "authorizationStates",
  "cookiesService",
  "authorizationUserData",
  function ($state, authorizationStates, cookiesService, authorizationUserData) {
    // this.authorized = false;
    // this.login = "";
    // this.roomId = "";

    this.clear = () => {
      authorizationUserData.authorized = false;
      $state.go(authorizationStates.authorization);
    };

    /** Store login in authorization service. */
    this.authorize = data => {
      ({
        authorized: authorizationUserData.authorized = true,
        login:  authorizationUserData.login = ""
      } = data);
      this.go();
    };

    this.unauthorize = () => {
      authorizationUserData.authorized = false;
      authorizationUserData.login = "";
      // TODO change name of the below service
      /** Destroy cookies */
      cookiesService.removeAuthorizationCookies();
      // TODO off all or some sockets???
      /** Go back to authorization state */
      this.go({state: authorizationStates.authorization});
    };

    // TODO some bullshit when trying to enter room that does not exist
    /** Passes roomId and information if the room is new. */
    this.go = data => {
      data = Object(data);
      /** Get data */
      let {
            state: state = authorizationUserData.authorized? authorizationStates.rooms: authorizationStates.home,
            roomId: roomId,
            newroom: newroom = false
          } = data;

      /** Store roomId in user's data. */
      authorizationUserData.roomId = roomId;

      $state.go(state, {
        "roomId": roomId,
        "newroom": newroom
      });
    };
  }]
);
