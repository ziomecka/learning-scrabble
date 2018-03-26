/* jshint esversion: 6 */
import angular from "angular";

angular.module("scrabbleModule", ["boardModule", "bagModule", "playerModule"]);

import boardModule from "./board/board";
import bagModule from "./bag/bag";
import playerModule from "./player/player";
