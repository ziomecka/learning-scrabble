/* jshint esversion: 6 */
module.exports = [
  "$scope",
  "authorizationService",
  ($scope, authorizationService) => {
    const me = $scope;
    me.logout = () => {
      authorizationService.unauthorize();
    };
  }
];
