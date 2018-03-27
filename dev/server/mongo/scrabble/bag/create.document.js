/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;
const lettersNumber = require("./letters.number");
const lettersPoints = require("./letters.points");
const findkey = require("lodash/findkey");

const create = options => {
  options = Object(options);
  let {lang: lang = "Polish"} = options;
  let letters = lettersNumber[lang];
  let points = lettersPoints[lang];
  let tiles = [];
  let tile;
  let tileId = 0;

  Object.keys(letters).forEach(letter => {
    let level = findkey(lettersPoints[lang], arr => arr.includes(letter));
    for(let i = 0, len = letters[letter]; i < len; i++) {
      tile = {
        _id: tileId++,
        letter: letter,
        points: points[level]
      };
      tiles.push(tile);
    }
  });

  return {
    _id: new ObjectID(),
    tiles: tiles
  };
};

module.exports = {
  create: create
};
