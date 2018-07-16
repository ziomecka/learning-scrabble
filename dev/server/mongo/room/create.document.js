/* jshint esversion: 6 */
const ObjectID = require("mongodb").ObjectID;
const games = require("../game/games");
const states = require("../../app/room/room.states");
const create = options => {
  // console.log("got optionns " + JSON.stringify(options));
  let {
    id: id = new ObjectID(),
    lang: lang = "Polish",
    time: time = 3,
    numberPlaces: numberPlaces = 2,
    name: name = "scrabble",
    collection: collection = "scrabble",
    owner: owner,
    state: state = states.get("waitingForPlayers")
  } = Object(options);

  // TODO improve
  if (!Number.isInteger(time)) time = 3;
  if (!Number.isInteger(numberPlaces)) numberPlaces = 2;

  let places = [];
  for (let i = 0; i < numberPlaces; i++) {
    places.push({
      "id": i
    });
  }
  places[0].player = games[collection].player({"login": owner});

  // console.log("state: " + state);
  return {
    "_id": id,
    "name": name,
    "owner": owner,
    "state": state,
    "places": places,
    "time": time,
    "game": games[collection].game({"lang": lang})
  };
};

module.exports = {
  create: create
};
