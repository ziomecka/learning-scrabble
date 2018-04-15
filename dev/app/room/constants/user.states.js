/* jshint esversion: 6 */
angular
  .module("roomModule")
  .constant("userStates", new Map(
    [
      ["considersPlaying", "considersPlaying"],
      ["waitsForGame", "waitsForGame"],
      ["makesStartDecision", "makesStartDecision"],
      ["plays", "plays"],
      ["observesGame", "observesGame"]
    ]
  ));
