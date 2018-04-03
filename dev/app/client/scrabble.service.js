/* jshint esversion: 6 */
// TODO use scrabble service
angular
  .module("app")
  .service("scrabbleService", [
    "socketService",
    "appEvents",
    function (socketService, appEvents) {
      this.createScrabble = options => {
        let {callback: {successCreateScrabble}} = options;
        socketService.on(appEvents.resCreateScrabbleSuccess, data => {
          successCreateScrabble(data);
          console.log(`I have been informed about creating game with id: ${data.id}.`);
        });
      };
    }
  ]);
