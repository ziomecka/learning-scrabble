/* jshint esversion: 6 */
class Service {
  constructor (
    roomControlsSocket,
    routerGoService,
    userData,
    roomService,
    roomPlayersService,
    userStates
  ) {
    "ngInject";

    Object.assign(this, {
      roomControlsSocket,
      routerGoService,
      userData,
      roomService,
      roomPlayersService,
      userStates
    });
  }

  start () {
    this.roomControlsSocket.start({
      success: data => {
        this.userData.gameId = data.gameId; // TODO clear once game is over;
        this.roomService.startGame();
      },
      failure: () => {
        // this.roomService.waitForGame();
        // TODO modal
      }
    });
  }

  leave () {
    this.roomControlsSocket.leaveRoom({
      success: () => {
        this.roomService.clear();
        this.routerGoService.go();
      },
      failure: () => {
        // TODO modal
      }
    });
  }

  getUp () {
    this.roomControlsSocket.getUp({
      "placeId": this.roomPlayersService.seated,
      success: data => {
        this.removeUserFromPlace(data);
      },
      failure: () => {
        // TODO modal
      }
    });
  }

  removeUserFromPlace (data) {
    this.roomPlayersService.removePlayer(data);
    this.userData.state = this.userStates.get("considersPlaying");
  }
}

angular // eslint-disable-line no-undef
  .module("roomModule")
  .service("roomControlsService", Service);
