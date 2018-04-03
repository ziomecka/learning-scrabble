/* jshint esversion: 6 */
import events from "../../server/scrabble/scrabble.events";

 angular
   .module("app")
   .constant("scrabbleEvents", events);
