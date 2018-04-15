/* jshint esversion: 6 */
angular
  .module("roomModule")
  .constant("playerStates", new Map(
    [
      ["waitingForGame", "waitingForGame"],
      ["observingRoom", "observingRoom"],
      ["waitingForRound", "waitingForRound"],
      ["placingWord", "placingWord"],
      ["exchangingTiles", "exchanginTiles"],
      ["acceptingWord", "acceptingWord"]
    ]
  ));
