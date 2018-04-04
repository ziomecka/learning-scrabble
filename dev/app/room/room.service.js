/* jshint esversion: 6 */
angular
  .module("roomModule")
  .service("roomService", [
    "socketService",
    "roomEvents",
    function (socketService, roomEvents) {

      // clientService.emit("room: get player statuses");
      // clientService.on("room: player statuses sent", data => this.statusPlayer = data);
      //
      this.changeNumberPlaces = options => {
        let {id, number, callback: {successChanged}} = options;

        socketService.emit(roomEvents.reqNumberPlacesChanged, {
          id: id,
          number: number
        });

        socketService.on(roomEvents.resNumberPlacesChanged, data => {
          successChanged(data);
          socketService.off(roomEvents.resNumberPlacesChanged);
        });
      };

      this.takePlace = options => {
        let {roomId, placeId, callback: {successTakePlace}} = options;

        socketService.emit(roomEvents.reqTakePlace, {
          roomID: roomId,
          placeId: placeId,
          login: authorizationService.login
        });

        let eventName = roomEvents.resTakePlace;
        socketService.on(eventName, data => {
          successTakePlace(data);
          socketService.off(eventName);
        });
      };

      this.getUp = options => {
        let {roomId, placeId, callback: {successGetUp}} = options;
        socketService.emit(roomEvents.reqGetUp, {
          roomID: roomId,
          placeId: placeId,
          login: authorizationService.login
        });

        let eventName = roomEvents.resGetUp;
        socketService.on(eventName, data => {
            successGetUp(data);
            socketService.off(eventName);
        });
      };

      // this.askPlayerStart = options => {
      //   let {callback: {successAskPlayerStart}} = options;
      //   socketService.on(roomEvents.resAskPlayerStart, () => {
      //     successAskPlayerStart();
      //   });
      // };


      this.listenAskForAcceptance = options => {
        let {callbacks: ask} = options;
        let eventName = roomEvents.askForAcceptance;
        socektService.on(eventName, data => {
          ask();
          socketService.off(eventName);
        });
      };

      this.tellAccepted = options => {
        let {data} = options;
        let eventName = roomEvents.resAskForAcceptance;
        socektService.emit(eventName);
      };

      this.listenToStart = options => {
        let {callbacks: start} = options;
        let eventName = roomEvents.start;
        socektService.on(eventName, data => {
          start();
          socketService.off(eventName);
        });
      };

    }
  ]);
