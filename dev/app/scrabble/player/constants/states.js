/* jshint esversion: 6 */
const constant = new Map(
  [
    ["waitingForRound", "waitingForRound"],
    ["playing", "playing"],
    ["acceptingWord", "acceptingWord"]
  ]
);

angular // eslint-disable-line no-undef
  .module("scrabblePlayerModule")
  .constant("scrabblePlayerStates", constant);
