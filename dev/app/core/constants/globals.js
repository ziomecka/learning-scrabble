/* jshint esversion: 6 */
const constant = {
  "shorterTitleTime": 800,  // animation of title
  "delayedViewTime": 810,   // animation of title
  "x-app": "scrabble"       // socket-io header
};

angular // eslint-disable-line no-undef
  .module("app")
  .constant("appGlobals", constant);
