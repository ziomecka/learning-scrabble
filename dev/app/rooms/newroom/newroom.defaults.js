/* jshint esversion: 6 */
angular
  .module("roomsModule")
  .constant("newroomDefaults", {
    name: "scrabble",
    placesOptions: [2, 3, 4],
    timeOptions: [3, 5, 7, 10, 15]
  });
