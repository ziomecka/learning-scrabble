/* jshint esversion: 6 */
/** Ui-router states. */
angular
  .module("routerModule")
  .constant("routerStates", {
    "home": "home",
    "authorization": "home.authorization",
    "newuser": "home.newuser",
    "games": "home.games",
    "rooms": "home.games.rooms",
    "room": "home.games.room"
  });
