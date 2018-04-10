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
      [6, 6],
      [6, 10],
      [8, 8],
      [10, 6],
      [10, 10],
      [11, 5],
      [11, 11],
      [12, 4],
      [12, 12],
      [13, 3],
      [13, 13],
      [14, 2],
      [14, 14],
    ],
    "word3": [
      [1, 1],
      [1, 8],
      [1, 15],
      [8, 1],
      [8, 15],
      [15, 1],
      [15, 8],
      [15, 15]
    ],
    "letter2": [
      [1, 4],
      [1, 12],
      [3, 7],
      [3, 9],
      [4, 8],
      [4, 15],
      [7, 3],
      [7, 7],
      [7, 9],
      [7, 13],
      [8, 4],
      [8, 12],
      [9, 3],
      [9, 7],
      [9, 9],
      [9, 13],
      [12, 8],
      [12, 15],
      [13, 7],
      [13, 9],
      [15, 4],
      [15, 12]
    ],
    "letter3": [
      [2, 6],
      [2, 10],
      [6, 2],
      [6, 6],
      [6, 10],
      [6, 14],
      [10, 2],
      [10, 6],
      [10, 10],
      [10, 14],
      [14, 6],
      [14, 10]
    ]
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
