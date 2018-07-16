/* jshint esversion: 6 */
const constant = new Map([
  ["alreadyPlayed", Symbol("alreadyPlayed")],
  ["inBag", Symbol("bag")],
  ["onRack", Symbol("rack")],
  ["beingPlayed", Symbol("beingPlayed")],
  ["beingExchanged", Symbol("beingExchanged")],
  ["placedOnBoard", Symbol("played")]
]);

angular // eslint-disable-line no-undef
  .module("scrabbleTileModule")
  .constant("scrabbleTileStates", constant);
