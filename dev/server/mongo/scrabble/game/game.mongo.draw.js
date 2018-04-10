/* jshint esversion: 6 */
const crud = require("../../mongo.crud");

const result = {
  draw: draw
};

function draw(options) {
  options = Object(options);
  let {number, gameId} = options;

  try {
    const game = crud.findOne({
      collection: "games",
      query: {}
    });
  } catch(e) {
    result.onerror(e.message);
  }

const bag = game.bag;
const tiles = [];
let index;
let tile;
for (let i = 0; i < number; i ++) {
  index = Math.floor(Math.random() * bag.length);
  tiles.push(bag.splice(index, 1));
}

/* Resolve promise */
  result.ondraw(tiles);
}

module.exports = result;
