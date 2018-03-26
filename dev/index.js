/* jshint esversion: 6 */
import angular from "angular";

import scrabbleModule from "./scrabble/scrabble";
import appModule from "./app/app";

angular("all", ["appModule", "scrabbleModule"]);
