/* jshint esversion: 6 */
class appController {
  constructor($scope, $timeout, appSocket, appGlobals) {
      "ngInject";
      $timeout(() => {
        this.shortTitle = true;
      }, appGlobals.shorterTitleTime);
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
