/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;

const create = options => {
  options = Object(options);
  let {id: id = ObjectID(), name: name = "...", points: points = 0, time: time = 3, tiles: tiles = []} = options;

  return {
    "_id": id,
    "name": name,
    "points": 0,
    "time": time,
    "tiles": tiles
  };
};

module.exports = {
  create: create
};
