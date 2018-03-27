/* jshint esversion: 6 */
angular
.module("boardModule")
.constant("boardOptions", {
  size: 15,
  bonuses: {
    "word2": [
      [2, 2],
      [2, 14],
      [3, 3],
      [3, 13],
      [4, 4],
      [4, 12],
      [5, 5],
      [5, 11],
      [8, 8],
      [14, 2],
      [14, 14],
      [13, 3],
      [13, 13],
      [12, 4],
      [12, 12],
      [11, 5],
      [11, 11],
    ],
    "word3": [
      [1, 1],
      [1, 8],
      [1, 15],
      [8, 1],
      [8, 8],
      [8, 15],
      [15, 1],
      [15, 8],
      [15, 15]
    ],
    "letter2": [],
    "letter3": []
  },
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
});
