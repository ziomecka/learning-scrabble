/* jshint esversion: 6 */
/** Initialised via ui-router */
module.exports = class RoomController {
  constructor (
    roomService,
    modalsFactory,
    $stateParams,
    $scope
  ) {
    "ngInject";

    Object.assign(this, {
      roomService,
      modalsFactory,
      $stateParams
    });

    $scope.$on("$destroy", () => {
      this.$onDestroy();
    });
  }

  get name () {
    return this.roomService.name;
  }

  get owner () {
    return this.roomService.owner;
  }

  get userOwnsRoom () {
    return this.roomService.userOwnsRoom;
  }

  get state () {
    return this.roomService.state;
  }

  get isPlaying () {
    return this.roomService.isPlaying;
  }

  get userCanGetUp () {
    return this.roomService.userCanGetUp;
  }

  get userCanStart () {
    return this.roomService.userCanStart;
  }

  get userCanLeave () {
    return this.roomService.userCanLeave;
  }

  get userCanChangeOptions () {
    return this.roomService.userCanChangeOptions;
  }

  get userIsPlayer () {
    return this.roomService.userIsPlayer;
  }

  $onInit () {
    this.roomService.initializeRoom({
      "collection": this.$stateParams.collection
    });
  }

  $onDestroy () {
    this.roomService.destroyRoom();
    this.$stateParams = null;
  }

  closeModal(id) {
    if (id === undefined) {
      id = "roomErrorModal";
    }
    this.modalsFactory.close(id);
  }
};
