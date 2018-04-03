/* jshint esversion: 6 */
angular
  .module("authorizationModule")
  .constant("authorizationStates", {
    "home": "home",
    "authorization": "authorization",
    "newuser": "newuser",
    "games": "games",
    "rooms": "games.rooms",
    "room": "games.room"
  });
