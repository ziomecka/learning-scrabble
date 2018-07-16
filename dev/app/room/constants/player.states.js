/* jshint esversion: 6 */
const constant = new Map(
  [
    ["waitingForGame", "waitingForGame"],
    ["observingRoom", "observingRoom"],
    ["waitingForRound", "waitingForRound"],
    ["placingWord", "placingWord"],
    ["exchangingTiles", "exchanginTiles"],
    ["acceptingWord", "acceptingWord"]
  ]
);

angular // eslint-disable-line no-undef
  .module("roomModule")
  .constant("playerStates", constant);
