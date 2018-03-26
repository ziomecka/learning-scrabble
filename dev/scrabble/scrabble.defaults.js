/* jshint esversion: 6 */
angular
.module("scrabbleModule")
.value("scrabbleDefaults", {
  name: "scrabble",
  owner: {
    name: "Player"
  },
  placesOptions: [2, 3, 4],
  timeOptions: [3, 5, 7, 10, 15]
});
