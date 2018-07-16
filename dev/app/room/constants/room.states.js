/* jshint esversion: 6 */
const constant = new Map([
  ["waitingForPlayers", "waitingForPlayers"],
  ["waitingForStart", "waitingForStart"],
  ["waitingForOtherPlayersStart", "waitingForOtherPlayersStart"],
  ["playing", "playing"],
  ["closed", "closed"],
]);

angular // eslint-disable-line no-undef
  .module("roomModule")
  .constant("roomStates", constant);
