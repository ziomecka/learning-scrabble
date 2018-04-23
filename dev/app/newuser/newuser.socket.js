/* jshint esversion: 6 */
angular
  .module("newuserModule")
  .service("newuserSocket", [
    "socketFactory",
    "newuserEvents",
    "authorizationService",
    function (socketFactory, newuserEvents, authorizationService) {
      this.createUser = options => {
        let {data, callbacks: {failureLogin}} = options;
        let off = () => {
          socketFactory.off(newuserEvents.resDuplicatedLogin);
          socketFactory.off(newuserEvents.resNewuserSuccess);
        };
        socketFactory.emit(newuserEvents.reqNewuser, data);
        socketFactory.on(newuserEvents.resDuplicatedLogin, () => {
          loginNotUnique = true;
          off();
        });
        socketFactory.on(newuserEvents.resNewuserSuccess, data => {
          off();
          authorizationService.authorize(data);
        });
      };
    }
  ]);
