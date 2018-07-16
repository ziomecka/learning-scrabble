/* jshint esversion: 6 */
class RoomOptionsService {
  constructor (
    roomEvents,
    socketFactory,
    modalsFactory
  ) {
    "ngInject";

    Object.assign(this, {
      roomEvents,
      socketFactory,
      modalsFactory
    });

    this._time = undefined;
    this._timeOld = undefined;

    this._numberPlaces = undefined;
    this._numberPlacesOld = undefined;

    this.listens = [
      {
        name: roomEvents.resChangeTimeSuccess,
        callback: data => {
          this._time = data.time;
        }
      },
      {
        name: roomEvents.resChangeTimeFailure,
        callback: () => {
          this.restore("time");
          this.modalsFactory.open({
            id: "roomErrorModal",
            message: "Time has not been changed. Please try again."
          });
        }
      }
    ];
  }

  listen () {
    this.socketFactory.listen(this.listens);
  }

  stopListen () {
    this.socketFactory.stopListen(this.listens);
  }

  get time () {
    return this._time;
  }

  set time (time) {
    if (this._time !== undefined && this._time !== time) {
      this._timeOld = this._time;
      this._time = time;
      this.socketFactory.emitHandler({
        emit: {
          eventName: this.roomEvents.reqChangeTime,
          data: {
            "time": time
          }
        }
      });
    } else {
      this._time = time;
    }
  }

  get numberPlaces () {
    return this._numberPlaces;
  }

  set numberPlaces (number) {
    if (this._numberPlaces !== undefined && this._numberPlaces !== number) {
      this._numberPlacesOld = this._numberPlaces;
      this._numberPlaces = number;
      this.socketFactory.emitHandler({
        emit: {
          eventName: this.roomEvents.reqChangeNumberPlaces,
          data: {
            "number": number
          }
        }
      });
    } else {
      this._numberPlaces = number;
    }
  }

  restore (property) {
    this[`_${property}`] = this[`${property}Old`];
    this[`${property}Old`] = undefined;
  }

  clear () {
    this._time = undefined;
    this._numberPlaces = undefined;
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomOptionsService", RoomOptionsService);
