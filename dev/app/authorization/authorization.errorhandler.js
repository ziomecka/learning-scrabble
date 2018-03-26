/* jshint esversion: 6 */
angular
.module("authorizationModule")
.run([
  "$transitions",
  "$state",
  ($transitions, $state) => {
  $transitions.onError({}, function (trans) {
    if (trans.error().detail  === "not authorized") $state.go("authorization");
  });
}]);
