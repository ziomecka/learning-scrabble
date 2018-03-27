/* jshint esversion: 6 */
angular
.module("authorizationModule")
.service("authorizationService", function ($state) {
  this.authorized = true;
  this.guest = false;
  this.login = "";

  this.clear = () => {
    this.authorized = false;
    $state.go("authorization");
  };

  this.authorize = data => {
    ({
      authorized: this.authorized = true,
      guest: this.guest = false,
      login:  this.login = ""
    } = data);
  };

  this.go = data => {
    data = Object(data);
    let {state: state = "private.rooms", roomId: roomId = ""} = data;
    $state.go(state, {"roomId": roomId});
  };
});
