angular
.module("roomModule")
.component("roomComponent", {
  bindings: {
    roomData: "<"
  },
  templateUrl: "../room.html",
  controller: "roomController"
});
