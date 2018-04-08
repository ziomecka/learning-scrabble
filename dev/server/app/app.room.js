/* jshint esversion: 6 */
/** One object per room room.
    Stores room state.
    Changes the state of the room in response to player actions.
    Notifies players about these changes.
    Creates room.
    */
const UUID = require("uuid");
const Place = require("./app.place");
const statusGame = require("../maps/server.status.game");
const accessMap = require("./app.access.map");

const rooms = new Map();
let roomUUID = 1;

class Room {
  constructor (options) {
    /** Set name */
    let name = options.name || "room";
    /** Avoid dupes */
    if (Array.from(rooms.values()).some((item) => item.name === name)) {
      this.name = `${name}${roomUUID++}`;
    } else {
      this.name = name;
    }

    this.id = UUID();
    // this.status = statusGame.waiting;
    this.places = [];
    this.addPlaces(options.numberPlaces);

    /** add to map */
    rooms.set(this.id, this);
  }

  addPlaces(num) {
    for(let i = 0; i < num; i ++) {
      this.places.push(new Place({id: i}));
    }
    let len = this.places.length;
    /* return added places */
    return this.places.slice(len - num, len + 1);
  }

  get numberPlaces() {
    return this.places.length;
  }

  get allPlacesTaken() {
    return this.places.every((place) => !place.isOpened);
  }

  /** playerID, playerName, roomID, placeId */
  setPlaceOwner(data) {
    /* Find place within all room's places and set its owner */
    // let id = this.places
    //   .filter((place) => place.id === data.placeId)[0]
    //   .setOwner({
    //     login: data.login
    //   }).id;
    //
    // return id;
  }

  setNumberPlaces(num) {
    if (num < this.numberPlaces) {
      return {
        action: "places removed",
        places: [] // TODO
      };
    } else if (num > this.numberPlaces) {
      return {
        action: "places added",
        places: this.addPlaces(num - this.places.length)
      };
    } else {
      return null;
    }
  }

  destroy () {
    // TODO
  }

  toJSON () {
    return {
      name: this.name,
      numberPlaces: this.numberPlaces,
      places: this.places,
      id: this.id,
      game: this.game
    };
  }
}

const allRooms = accessMap(rooms);

module.exports = {
  Room: Room,
  allRooms: allRooms
};
