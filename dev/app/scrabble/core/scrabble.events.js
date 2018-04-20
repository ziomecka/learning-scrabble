/* jshint esversion: 6 */
import events from "../../../server/scrabble/scrabble.events";

angular
  .module("scrabbleModule")
  .constant("scrabbleEvents", events);
