/* jshint esversion: 6 */
angular
  .module("app")
  .service("appSocket", [
    "socketService",
    "appEvents",
    function (socketService, appEvents) {
      this.connection = () => {
        socketService.on(appEvents.resConnected, data => console.log("I'm connected"));
        socketService.on("disconnect", () => console.log("I have been disconnected"));
      };

      this.removeListeners = () => {
        socketService.getSocket().removeAllListeners();
      };
    }
  ]);
