/* jshint esversion: 6 */
angular
.module("bagModule")
.constant("lettersPoints", {
  "Polish": {
    "blank": ["blank"],
    "level1": ["a", "e", "i", "n", "o", "r", "s", "w", "z"],
    "level2": ["c", "d", "k", "l", "m", "p", "t", "y"],
    "level3": ["b", "g", "h", "j", "ł", "u"],
    "level4": ["ą", "ę", "f", "ó", "ś", "ż"],
    "level5": ["ć"],
    "level6": ["ń"],
    "level7": ["ź"]
  },
  "English": {
    "blank": ["blank"],
    "level1": ["e", "a", "i", "n", "o", "r", "s", "t", "l", "u"],
    "level2": ["g", "d"],
    "level3": ["b", "c", "m", "p"],
    "level4": ["f", "h", "v", "w", "y"],
    "level5": ["k"],
    "level6": ["j", "x"],
    "level7": ["q", "z"]
  }
});
