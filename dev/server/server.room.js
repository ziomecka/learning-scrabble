/* jshint esversion: 6 */
/** One object per room room.
    Stores room state.
    Changes the state of the room in response to player actions.
    Notifies players about these changes.
    Creates room.
    */
const UUID = require("uuid");
const Place = require("./server.place");
const statusGame = require("./maps/server.status.game");
const rooms = new Map();
let roomUUID = 1;

class Room {
  constructor (options) {
    /** set name, avoid dupes */
    let name = options.name || "room";
    if (Array.from(rooms.values()).some((item) => item.name === name)) {
      this.name = `${name}${roomUUID++}`;
    } else {
      this.name = name;
    }

    this.id = UUID();
    this.status = statusGame.waiting;
    this.places = [new Place(options.owner)];

    this.addPlaces(options.numberPlaces - 1);

    /** add to map */
    rooms.set(this.id, this);
  }

  addPlaces(num) {
    for(let i = 0; i < num; i ++) {
      this.places.push(new Place());
    }
    let len = this.places.length;
    return this.places.slice(len - num, len + 1);
  }

  get numberPlaces() {
    return this.places.length;
  }

  /** playerID, playerName, roomID, placeID */
  setPlaceOwner(data) {
    this.places.filter((item) => item.id === data.placeID)[0].setOwner({id: data.playerID, name: data.playerName});
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

}

const allRooms = (() => {
  return {
    data: () => Array.from(rooms.values()),
    getProperty: property => Array.from(rooms.values()).map(item => {
      return {id: item.id, [property]: item[property]};
    }),
    getRoomDetails: id => rooms.get(id),
    ids: () => Array.from(rooms.keys())
  };
})();

module.exports.Room = Room;
module.exports.allRooms = allRooms;
