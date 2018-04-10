/* jshint esversion: 6 */
angular
  .module("roomModule")
  .constant("playerStates", new Map(
    [
      ["wait", Symbol("wait")]
    ]
  ));
