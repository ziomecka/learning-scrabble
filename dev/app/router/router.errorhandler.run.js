/* jshint esversion: 6 */
// TODO - validate if needed
angular
  .module("routerModule")
  .run([
    "$transitions",
    "$state",
    ($transitions, $state) => {
      $transitions.onError({}, function (trans) {
        if (trans.error().detail  === "not authorized") {
          $state.go("authorization");
        }
      });
    }
  ]);
