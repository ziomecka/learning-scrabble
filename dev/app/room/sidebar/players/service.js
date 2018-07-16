/* jshint esversion: 6 */
class RoomPlayersService {
  constructor (
    roomPlayersSocket,
    roomOptionsService,
    roomGameService,
    userData,
    roomEvents,
    socketFactory,
    userStates
  ) {
    "ngInject";

    Object.assign(this, {
      roomPlayersSocket,
      roomOptionsService,
      roomGameService,
      userData,
      roomEvents,
      socketFactory,
      userStates
    });

    this.listens = [
      {
        name: this.roomEvents.resOtherUserTookPlace,
        callback: data => {
          this.addPlayer(data);
        }
      },
      {
        name: this.roomEvents.resOtherPlayerGotUp,
        callback: data => {
          this.removePlayer(data);
        }
      },
      {
        name: roomEvents.resChangeNumberPlacesSuccess,
        callback: data => {
          this.places = data.places;
        }
      },
      {
        name: roomEvents.resChangeNumberPlacesFailure,
        callback: () => {
          this.roomOptionsService.restore("numberPlaces");
        }
      }
    ];

    this._places = [];
  }

  get newPoints () {
    return this.roomGameService.points;
  }

  get places () {
    return this._places;
  }

  set places (places) {
    this._places = places;

    /** isUser property is used in template to show points to be gained. */
    let user = this.user;
    if (user) {
      this.isUser = true;
    }
    user = null;

    this.roomOptionsService.numberPlaces = this._places.length;
  }

  get opponents () {
    return this._places
    .filter(place => {
      return place.player.login !== undefined && place.player.login !== this.userData.login;
    }, this);
  }

  get user () {
    let place = this._places
    .find(place => {
      if (place.player) {
        return place.player.login === this.userData.login;
      }
    }, this);

    if (place) {
      console.log("player" + JSON.stringify(place.player));
    }
    return place? place.player : undefined;
  }

  get players () {
    return this._places
    .filter(place => {
      return place.player.login !== undefined;
    });
  }

  get seated () {
    return this.places
    .findIndex(place => {
      if (place.player) {
        return place.player.login === this.userData.login;
      } else {
        return false;
      }
    });
  }

  sit (placeId) {
    let callbackSuccess = data => {
      this.userData.state = this.userStates.get("waitsForGame");
      this.addPlayer({
        "placeId": data.placeId,
        "login": this.userData.login
      });
    };

    let callbackFailure = () => {
      // TODO
    };

    this.roomPlayersSocket.sit({
      "placeId": placeId,
      "success": data => {
        callbackSuccess(data);
        callbackSuccess = null;
        callbackFailure = null;
      },
      "failure": () => {
        callbackFailure();
        callbackSuccess = null;
        callbackFailure = null;
      }
    });
  }

  addPlayer (data) {
    let player = {};
    ({
      login: player.login,
      points: player.points = 0,
      time: player.time = this.roomOptionsService.time
    } = data);

    this.places[data.placeId].player = player;
    player = null;
  }

  removePlayer (data) {
    // this.places[data.placeId].player = null;
    this.places[data.placeId] = {id: data.placeId};
  }

  listen () {
    this.socketFactory.listen(this.listens);
  }

  stopListen () {
    this.socketFactory.stopListen(this.listens);
  }

  clear () {
    this.roomOptionsService.clear();
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomPlayersService", RoomPlayersService);
