/* jshint esversion: 6 */
class appController {
  constructor($scope, $timeout, appSocket, authorizationGlobals) {
      "ngInject";
      $timeout(() => {
        this.shortTitle = true;
      }, authorizationGlobals.shorterTitleTime);
      appSocket.connection();
  }
  // TODO not here
  // logout () {
  //   // authorizationService.clear();
  // }
}

angular
  .module("app")
  .controller("appController", appController);
