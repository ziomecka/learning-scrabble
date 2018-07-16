/* jshint esversion: 6 */
import events from "../../../../server/scrabble/scrabble.events";

angular // eslint-disable-line no-undef
  .module("scrabbleModule")
  .constant("scrabbleEvents", events);
