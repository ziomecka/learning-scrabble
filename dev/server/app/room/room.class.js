/* jshint esversion: 6 */
/** One object per room room.
    Stores room state.
    Changes the state of the room in response to player actions.
    Notifies players about these changes.
    Creates room.
    */
const UUID = require("uuid");
const Place = require("./place.class");
const statusGame = require("../../maps/server.status.game");
const accessMap = require("../handlers/app.access.map");

const rooms = new Map();
/** Counter added to duplicates in names. */
let roomUUID = 1;

class Room {
  constructor (options) {
    /** Set name */
    let name = options.name || "room";
    /** Avoid duplicates in names by adding a counter. */
    if (Array.from(rooms.values()).some((item) => item.name === name)) {
      this.name = `${name}${roomUUID++}`;
    } else {
      this.name = name;
    }

    this.id = UUID();
    // this.status = statusGame.waiting;
    this.places = [];
    this.addPlaces(options.numberPlaces);

    /** Player sits on the first place */
    if(options.joinRoom && options.login) {
      this.setPlaceOwner({
        placeId: 0,
        login: options.login
      });
    }
    /** Add room to map. */
    rooms.set(this.id, this);
  }

  addPlaces(num) {
    let n = this.numberPlaces;
    for(let i = n, len = num + n; i < len; i ++) {
      /** Places' ids === indexes in array */
      this.places.push(new Place({id: i}));
    }
    let len = this.places.length;
    /* return added places */
    return this.places.slice(len - num, len + 1);
  }

  /** Return ids of openedPlaces, sorted ascending */
  get openedPlaces () {
    return this.places
    .reduce((acc, currVal, currInd, arr) => {
      if (currVal.isOpened) {
        acc.push(currVal.id);
      }
      return acc;
    }, [])
    .sort((a, b) => {
      return a - b;
    });
  }

  removePlaces(num) {
    let j = 0;
    let index;
    let result = [];
    // console.log(`places opened: ${JSON.stringify(this.openedPlaces)}`);
    while (num) {
      index = this.openedPlaces[this.openedPlaces.length - 1 - j];
      result = [...result, ...this.places.splice(index, 1)];
      // console.log(`index: ${index}`);
      num--;
      j++;
    }
    /** TODO garbage collect */
    // console.log(`places to be removed: ${JSON.stringify(result)}`);
    return result;
  }

  get numberPlaces() {
    return this.places.length;
  }

  get allPlacesTaken() {
    return this.places.every((place) => !place.isOpened);
  }

  /** Data = player's login, placeId. */
  setPlaceOwner(data) {
    /** Find place by index (id === index) and set its owner. */
    return this.places[data.placeId].setOwner({
          login: data.login
        }).id;
  }

  setNumberPlaces(num) {
    if (num < this.numberPlaces) {
      return {
        action: "removed",
        places: this.removePlaces(this.numberPlaces - num)
      };
    } else if (num > this.numberPlaces) {
      return {
        action: "added",
        places: this.addPlaces(num - this.numberPlaces)
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
