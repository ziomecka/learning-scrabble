/* jshint esversion: 6 */
angular
  .module("routerModule")
  .service("routerGoService", [
    "$state",
    "routerStates",
    "userData",
    function ($state, routerStates, userData) {
      // TODO some bullshit when trying to enter room that does not exist
      /** Passes roomId and information if the room is new. */
      this.go = data => {
        data = Object(data);
        /** Get data */
        let {
              state: state = userData.authorized? routerStates.rooms: routerStates.home,
              roomId: roomId,
              newroom: newroom = false
            } = data;

        /** Store roomId in user's data. */
        userData.roomId = roomId;

        $state.go(state, {
          "roomId": roomId,
          "newroom": newroom
        });
      };
    }]
  );
