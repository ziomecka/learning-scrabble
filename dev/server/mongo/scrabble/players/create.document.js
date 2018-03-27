/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;

const create = options => {
  options = Object(options);
  let {name: name, time: time, id: id} = options;
  let tiles = [];

  return {
    "_id": new ObjectID(),
    "points": 0,
    "time": time,
    "tiles": tiles
  };
};

module.exports = {
  create: create
};
