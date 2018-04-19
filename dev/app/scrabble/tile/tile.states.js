/* jshint esversion: 6 */
const tileStates = () => {
  return new Map([
    ["board", Symbol("board")],
    ["bag", Symbol("bag")],
    ["player", new Map([
      ["rack", Symbol("rack")],
      ["exchanged", Symbol("exchanged")],
      ["played", Symbol("played")]
    ])]
  ]);
};

angular
  .module("tileModule")
  .constant("tileStates", tileStates);
