/* jshint esversion: 6 */
import states from "../../../../../server/scrabble/states/scrabble.states.game";

angular // eslint-disable-line no-undef
  .module("scrabbleGameModule")
  .constant("scrabbleGameStates", states);
