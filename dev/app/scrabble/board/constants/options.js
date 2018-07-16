/* jshint esversion: 6 */
const constant = {
  view: {
    "board": {
      "id": "scrabbleBoard",
      "className": "scrabble__board"
    },
    "row": {
      "id": "scrabbleRow",
      "className": "scrabble__row"
    },
    "field": {
      "id": "scrabbleField",
      "className": "scrabble__field",
    },
    "firstRow": {
      "className": "scrabble__row scrabble__field--description",
    },
    "descriptionField": {
      "className": "scrabble__field scrabble__field--description",
    }
  }
};

angular // eslint-disable-line no-undef
  .module("scrabbleBoardModule")
  .constant("scrabbleBoardOptions", constant);
