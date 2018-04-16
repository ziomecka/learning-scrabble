/* jshint esversion: 6 */
module.exports = class AppController {
  constructor($timeout, appSocket, appGlobals) {
    "ngInject";
    this.shortTitle = false;
    $timeout(() => {
      this.shortTitle = true;
    }, appGlobals.shorterTitleTime);
    appSocket.connection();
  }
  // TODO not here
  // logout () {
  //   // authorizationService.clear();
  // }
};

// angular
//   .module("app")
//   .controller("appController", appController);
