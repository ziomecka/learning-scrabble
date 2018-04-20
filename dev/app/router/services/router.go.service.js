/* jshint esversion: 6 */
class RouterGoService {
  constructor (
    $state,
    routerStates,
    userData
  ) {
    "ngInject";

    Object.assign(this, {
      $state,
      routerStates,
      userData
    });
  }

  // TODO some bullshit when trying to enter room that does not exist
  go (data) {
    /** Get data */
    let {
      state: state = this.userData.authorized? this.routerStates.rooms: this.routerStates.home,
      roomId: roomId,
      newroom: newroom = false // TODO remove?
    } = Object(data);

    /** Store roomId in user's data. */
    this.userData.roomId = roomId;

    /** Pass roomId and information if the room is new. */
    this.$state.go(state, {
      "roomId": roomId,
      "newroom": newroom
    });
  }
}

angular
  .module("routerModule")
  .service("routerGoService", RouterGoService);
