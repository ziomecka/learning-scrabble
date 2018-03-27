/* jshint esversion: 6 */
const mongo = require("../../mongo.client");
const crud = require("../../mongo.crud");

const ObjectID = require("mongodb").ObjectID;

const createBag = require("../bag/create.document").create;
const createBoard = require("../board/create.document").create;
const createPlayers = require("../players/create.document").create;
const createGame = require("./create.document").create;

let dbName = mongo.name;

let result = {
  insert:  insert
};

function insert (options) {
  options = Object(options);

  let {
    id: id = new ObjectID(),
    lang: lang = "Polish",
    numberPlayers: numberPlayers = 2
  } = options;

  const bag = createBag({"lang": lang});
  const board = createBoard();
  const players = createPlayers({"number": numberPlayers});
  const game = createGame({
    bagId: bag._id,
    boardId: board._id,
    playersId: players._id
  });

  try {
    crud.insertOne({collection: "bags", object: bag});
    crud.insertOne({collection: "board", object: board});
    crud.insertOne({collection: "players", object: players});
    crud.insertOne({collection: "games", object: game});
  } catch (e) {
    result.onerror(e.message);
  }

  /** Resolve promise. */
  result.oninsert({"id": id});
}

module.exports = result;
