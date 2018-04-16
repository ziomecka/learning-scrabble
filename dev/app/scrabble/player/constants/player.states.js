/* jshint esversion: 6 */
angular
  .module("playerModule")
  .constant("playerStates", new Map(
    [
      ["waitingForRound", "waitingForRound"],
      ["playing", "playing"],
      ["acceptingWord", "acceptingWord"]
    ]
  ));
