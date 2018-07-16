/* jshint esversion: 6 */
const constant = {
  name: "scrabble",
  placesOptions: [2, 3, 4],
  timeOptions: [3, 5, 7, 10, 15]
};

angular // eslint-disable-line  no-undef
  .module("roomsModule")
  .constant("newroomDefaults", constant);
