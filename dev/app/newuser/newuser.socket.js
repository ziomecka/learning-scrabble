/* jshint esversion: 6 */
angular
  .module("newuserModule")
  .service("newuserSocket", [
    "socketService",
    "newuserEvents",
    "authorizationService",
    function (socketService, newuserEvents, authorizationService) {
      this.createUser = options => {
        let {data, callbacks: {failureLogin}} = options;
        let off = () => {
          socketService.off(newuserEvents.resDuplicatedLogin);
          socketService.off(newuserEvents.resNewuserSuccess);
        };
        socketService.emit(newuserEvents.reqNewuser, data);
        socketService.on(newuserEvents.resDuplicatedLogin, () => {
          loginNotUnique = true;
          off();
        });
        socketService.on(newuserEvents.resNewuserSuccess, data => {
          off();
          authorizationService.authorize(data);
        });
      };
    }
  ]);
