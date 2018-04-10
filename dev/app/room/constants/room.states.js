/* jshint esversion: 6 */
angular
  .module("roomModule")
  .constant("roomStates", new Map(
    [
      ["waitingForPlayers", "waitingForPlayers"],
      ["waitingForStart", "waitingForStart"],
      ["waitingForOtherPlayersStart", "waitingForOtherPlayersStart"],
      ["gamePlayed", "gamePlayed"],
    ]
  ));
