/* jshint esversion: 6 */
angular
.module("scrabbleModule")
.service("scrabbleService", ($rootScope, clientService) => {
  this.players = [];
  clientService.emit("room: get player statuses");
  clientService.on("room: player statuses sent", data => this.statusPlayer = data);
});
