/* jshint esversion: 6 */
const crud = require("../../mongo.crud");

const draw = options => {
  let {number, gameId, login} = Object(options);

  let drawTiles = bag => {
    const tiles = [];
    for (let i = 0; i < number; i ++) {
      let index = Math.floor(Math.random() * bag.length);
      tiles.push(bag.splice(index, 1));
    }
    return {
      tiles: tiles,
      bag: bag
    }
  };

  crud.findOne({
    collection: "games",
    query: {_id: gameId}
  })
  .then(result => {
    let {bag, tiles} = drawTiles(result.bag);
    crud.updateOne({
      collection: "scrabble",
      query: {_id: gameId},
      update:{$set: {
        "bag": bag,
        "players.[login].tiles": tiles
      }}
    })
    .then(() => {
      return tiles;
    })
    .catch(err => {
      return err; // TODO
    });
  })
  .catch(err => {
    return err;
  })
  .finally(() => {
    drawTiles = null;
  });
}

module.exports = {
  draw: draw
};
