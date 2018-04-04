/* jshint esversion: 6 */
angular
  .module("roomModule")
  .constant("roomEvents", {
    reqNumberPlacesChanged: "room: change number of places",
    resNumberPlacesChanged: "room: number of places changed",
    reqTakePlace: "room: player takes place",
    resTakePlace: "room: player has taken place",
    reqGetUp: "room: player gets up",
    resGetUp: "room: player has got up",
    // resAskPlayerStart: "",
    resAskForAcceptance: "room: ask player to accept game",
    reqAskForAcceptance: "room: player accepted game",
    resStart: "room: start game",
    reqStart: "room: game has been started"
  });
