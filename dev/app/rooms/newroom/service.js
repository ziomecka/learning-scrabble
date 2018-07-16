/* jshint esversion: 6 */
class Service {
  constructor (
    newroomSocket,
    routerGoService,
    routerStates,
    roomsService,
    manageStatesService
  ) {
    "ngInject";

    Object.assign(this, {
      newroomSocket,
      routerGoService,
      routerStates,
      roomsService,
      manageStatesService
    });
  }

  get isIdle () {
    this.manageStatesService.isIdle = true;
  }

  get isWaiting () {
    return this.manageStatesService.isWaiting;
  }

  get isFailureother () {
    return this.manageStatesService.isFailureother;
  }

  get isSuccess () {
    return this.manageStatesService.isFailuresuccess;
  }

  createRoom (options) {
    let statesService = this.manageStatesService;
    let {data: {name, numberPlaces}} = Object(options);
    statesService.isWaiting = true;
    this.newroomSocket.createRoom({
      data: {
        name: name,
        numberPlaces: numberPlaces,
        collection: "scrabble",
        createGame: true, // game will be created
        joinRoom: true // user will join the room
      },
      success: data => {
        statesService.setTemporaryState({"state": "success"});
        statesService = null;
        /** If the room is created transfer user to room's state. */
        this.routerGoService.go({
          state: this.routerStates.room,
          roomId: data.roomId,
          collection: "scrabble"
        });
      },
      failure: () => {
        statesService.setTemporaryState({"state": "failureOther"});
        statesService = null;
      }
    });
  }
}

angular // eslint-disable-line no-undef
  .module("roomsModule")
  .service("newroomService", Service);
