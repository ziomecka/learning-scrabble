/* jshint esversion: 6 */
const constant =  new Map([
  ["considersPlaying", "considersPlaying"],
  ["waitsForGame", "waitsForGame"],
  ["makesStartDecision", "makesStartDecision"],
  ["plays", "plays"],
  ["observesGame", "observesGame"]
]);

angular // eslint-disable-line no-undef
  .module("roomModule")
  .constant("userStates", constant);
