/* jshint esversion: 6 */
class Service {
  constructor (
    $stateParams
  ) {
    "ngInject";

    /** Services */
    Object.assign(this, {
      $stateParams
    });

    this.login = undefined;
    /** RoomIdFrom ids needed on the server side - to unregister user from room. */
    this.roomIdFrom = undefined;
    // this.authorized = true;
    this.authorized = false;
    this.state = "home";
  }

  get roomId () {
    return this.$stateParams.roomId;
  }
}

angular // eslint-disable-line no-undef
  .module("userModule")
  .service("userData", Service);
