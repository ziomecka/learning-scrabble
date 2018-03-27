/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;
const dbName = require("../../mongo.client").name;

const create = options => {
  options = Object(options);
  let {bagId, boardId, playersId} = options;

  // TODO
  // if (bagId === undefined || boardId === undefined || playersId === undefined) {
  //   throw Error;
  // }

  return {
    _id: id,
    name: "scrabble",
    bag: {
      "$ref": "bags",
      "$id": bagId,
      "$db": dbName
    },
    board: {
      "$ref": "boards",
      "$id": boardId,
      "$db": dbName
    },
    players: {
      "$ref": "players",
      "$id": playersId,
      "$db": dbName
    }
  };
};

module.exports = {
  create: create
};
