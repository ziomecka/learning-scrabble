/* jshint esversion: 6 */
const constant = [
  {
    letter: "s",
    points: "1"
  },
  {
    letter: "c",
    points: "1"
  },
  {
    letter: "r",
    points: "1"
  },
  {
    letter: "a",
    points: "1"
  },
  {
    letter: "b",
    points: "1"
  },
  {
    letter: "b",
    points: "1"
  },
  {
    letter: "l",
    points: "3"
  },
  {
    letter: "e",
    points: "2"
  }
];

angular // eslint-disable-line no-undef
  .module("app")
  .constant("appTitle", constant);
