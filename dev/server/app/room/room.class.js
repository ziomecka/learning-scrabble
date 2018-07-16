/* jshint esversion: 6 */
const Player = require("../../scrabble/scrabble.player").Player;
const game = require("../game/games");
const states = require("./room.states");

module.exports = class Room {
  constructor (options) {
    ({
      name: this.name,
      places: this.places,
      owner: this._owner,
      state: this._state = states.get("waitingForPlayers"),
      time: this.time
    } = options);

    this.id = String(options._id);

    this.places.forEach(place => {
      let player = place.player
      if (player === Object(player) && !Player.isPlayer(player)) {
        place.player = new Player(player);
      }
      player = null;
    });
    /** Create game */
    // TODO: first check if game already exists?
    this.game = game.scrabble(options.game);
  }

  static isRoom (object) {
    return (
      object &&
      object instanceof this
    );
  }

  get state () {
    return this._state;
  }

  set state (state) {
    let s = states.get(state);
    this._state = s;
    s = null;
    return true;
  }

  get players () {
    return this.game.players;
  }

  get logins () {
    return this.players.map(player => {
      player.login;
    });
  }

  get sockets () {
    return this.players.reduce((acc, cv) => {
      let socketId = cv.socketId;
      if (socketId !== undefined) {
        acc.push(socketId);
      }
      return acc;
    }, []);
  }

  get owner () {
    return this._owner;
  }

  set owner (owner) {
    if (owner === undefined) {
      owner = this.places.find(place => {
        return (
          Player.isPlayer(place.player) &&
          place.login !== undefined
        );
      })
    }
    this._owner = owner.login;
    owner = null;
  }

  addPlaces (num) {
    let n = this.numberPlaces;
    for(let i = n, len = num + n; i < len; i ++) {
      /** Places' ids === indexes in array. */
      // this.places.push(new Place({id: i}));
    }
    let len = this.places.length;
    /** Return added places. */
    return this.places.slice(len - num, len + 1);
  }

  findPlayerBySocket (id) {
    return this.players.find(player => {
      return player.socketId.includes(id);
    });
  }
  /** Return ids of openedPlaces, sorted ascending */
  get openedPlaces () {
    return this.places
    .reduce((acc, currVal) => {
      if (currVal.isOpened) {
        acc.push(currVal.id);
      }
      return acc;
    }, [])
    .sort((a, b) => {
      return a - b;
    });
  }

  removePlaces (num) {
    let j = 0;
    let index;
    let result = [];
    while (num) {
      index = this.openedPlaces[this.openedPlaces.length - 1 - j];
      result = [...result, ...this.places.splice(index, 1)];
      num--;
      j++;
    }
    /** TODO garbage collect */
    return result;
  }

  get numberPlaces () {
    return this.places.length;
  }

  get allPlacesTaken () {
    console.log("this.places" + JSON.stringify(this.places));
    return this.places.every((place) => {
      return (
        Player.isPlayer(place.player) &&
        place.player.login
      );
    });
  }

  placeTakenByRoomOwner (placeId) {
    return (
      Player.isPlayer(this.places[placeId]) &&
      this.places[placeId].login === this.owner
    );
  }

  setPlayerState (options) {
    // console.log("setting player to ready")
    // console.log("this.places: " + JSON.stringify(this.places));
    let {login, state} = Object(options);

    let place = this.places.find(place => {
      if (
        Player.isPlayer(place.player) &&
        place.player.login
      ) {
        return place.player.login === login;
      }
    });

    if (place) {
      place.player.state = state;
    } else {
      return false;
    }
    place = null;
    return true;
  }

  allPlayersState (state) {
    return this.places.every(place => {
      if (Player.isPlayer(place.player)) {
        return place.player.state === state;
      }
    });
  }

  /** Data = player's login, placeId. */
  setPlaceOwner (data) {
    console.log("sets place owner with data: " + JSON.stringify(data));
    let {login, placeId} = data;
    /** If place is being left and was taken by room's owner then
        change the room's owner.
        */
    if (login === undefined) {
      if (this.placeTakenByRoomOwner(placeId)) {
        this._owner = undefined;
      }
    } else {
      if (this.owner === undefined) {
        this.owner = login;
      }
    }

    this.places[placeId] = {
      "id": placeId,
      "player": new Player({
        "login": data.login,
        "time": data.time = this.time,
        "points": data.points = 0
      })
    };
    // console.log("taken place: " + JSON.stringify(this.places[placeId]));
  }

  setNumberPlaces (num) {
    if (num < this.numberPlaces) {
      return {
        action: "removed",
        change: this.removePlaces(this.numberPlaces - num),
        places: this.places
      };
    } else if (num > this.numberPlaces) {
      return {
        action: "added",
        change: this.addPlaces(num - this.numberPlaces),
        places: this.places
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
      game: this.game,
      state: this.state,
      time: this.time,
      owner: this.owner
    };
  }
}
