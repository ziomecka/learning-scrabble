/* jshint esversion: 6 */
// const mongo = require("../../mongo.client");
const crud = require("../../mongo.crud");

const ObjectID = require("mongodb").ObjectID;

const createGame = require("./create.document").create;

// let dbName = mongo.name;

let result = {
  insert:  insert
};

function insert (options) {
  options = Object(options);

  let {
    id: id = new ObjectID(),
    lang: lang = "Polish",
    numberPlayers: numberPlayers = 2,
    time: time = 3
  } = options;

  const game = createGame({
    "id": id,
    "lang": lang,
    "numberPlayers": numberPlayers,
    "time": time
  });

  try {
    crud.insertOne({collection: "games", object: game});
  } catch (e) {
    result.onerror(e.message);
  }

  /** Resolve promise. */
  result.oninsert({"id": id});
}

module.exports = result;
