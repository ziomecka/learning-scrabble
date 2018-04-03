/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;
const dbName = require("../../mongo.client").name;
const bags = require("./assets/bags.json");
const boards = require("./assets/boards.json");
const createPlayer = require("../players/create.document").create;

const create = options => {
  options = Object(options);
  let {id: id = ObjectID(), lang: lang = "Polish", number = 2, time = 3} = options;

  let players = new Array(number).fill(createPlayer({time: time}));

  return {
    "_id": id,
    "name": "scrabble",
    "bag": bags[lang],
    "board": boards[lang],
    "players": players
  };
};

module.exports = {
  create: create
};
