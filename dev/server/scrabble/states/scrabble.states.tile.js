/* jshint esversion: 6 */
module.exports = new Map([
  ["board", Symbol("board")],
  ["bag", Symbol("bag")],
  ["player", new Map([
    ["rack", Symbol("rack")],
    ["exchanged", Symbol("exchanged")],
    ["played", Symbol("played")]
  ])]
]);
