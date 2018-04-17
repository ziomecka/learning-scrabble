/* jshint esversion: 6 */
module.exports = class RoomController {
  constructor (newroomDefaults, roomData, roomService) {
    "ngInject";

    // this.newroomDefaults = newRoomDefaults;
    this.defaults = newroomDefaults;
    this.roomData = roomData;
    this.roomService = roomService;

    // let me = $scope;

    /** Watch rommService's data */
    this.room = roomService.data.room;
    this.game = roomService.data.game;
    this.user = roomService.data.user;

    this.$onInit = () => {
      this.roomService.initializeRoom(roomData);
    };

    this.$onDestroy = () => {
      this.roomService.destroyRoom();
    };
  }

  numberPlacesChanged(number) {
    roomService.numberPlacesChanged(number);
  }

  timeChanged(time) {
    roomService.timeChanged(time);
  }

  takePlace(data) {
    this.roomService.takePlace(data);
  }

  getUp() {
    this.roomService.getUp();
  }
};
