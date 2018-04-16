/* jshint esversion: 6 */
angular
.module("tileModule")
.constant("tileStates", new Map([
  ["board", Symbol("board")],
  ["bag", Symbol("bag")],
  ["player", new Map([
    ["rack", Symbol("rack")],
    ["exchanged", Symbol("exchanged")],
    ["played", Symbol("played")]
  ])]
]));
