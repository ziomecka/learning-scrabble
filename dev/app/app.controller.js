/* jshint esversion: 6 */
// TODO create new room does not work!
// + unhandled promise rejections
// transport pooling https://stackoverflow.com/questions/28261546/transport-polling-error-with-socket-io
angular
  .module("app")
  .controller("appController", [
    "$scope",
    "$rootScope",
    "appSocket",
    "authorizationService",
    "$timeout",
    "authorizationGlobals",
    "$state",
    ($scope, $rootScope, appSocket, authorizationService, $timeout, authorizationGlobals, $state) => {
      let me = $scope;
      me.$state = $state;
      $rootScope.narrowTitle = false;
      me.narrowTitle = $rootScope.narrowTitle;
      $rootScope.$watch("narrowTitle", newValue => me.narrowTitle = newValue);
      /** Sets the standardTitle to tru after 2.5 seconds.
          Ui-router resolves the states with 3s delay
          (only these states that may occur after 'home' state, i.e.
          'authorization' state. That's why it is done via ui-router, not css).
          If standardTitle === true then
          the ng-class adds the '--short' class to the title
          that makes the title shorter. */
      $timeout(() => {
        me.shortTitle = true;
      }, authorizationGlobals.shorterTitleTime);
      me.logout = () => authorizationService.clear();
      appSocket.connection();
    }
  ]);
