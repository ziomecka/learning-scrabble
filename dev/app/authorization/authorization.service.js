/* jshint esversion: 6 */
angular
.module("authorizationModule")
.service("authorizationService", function ($state) {
  this.authorized = true;
  this.guest = false;
  this.login = undefined;

  this.clear = () => {
    this.authorized = false;
    $state.go("authorization");
  };

  this.go = data => {
    let state;
    ({
      authorized: this.authorized = true,
      guest: this.guest = false,
      login: this.login,
      state: state = "private.rooms"
    } = data);
    let params = {};
    params.roomId = data.roomId;
    $state.go(state, params);
  };
});
