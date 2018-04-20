/* jshint esversion: 6 */
module.exports = (
  $transition$,
  $q,
  $timeout,
  appGlobals
) => {
  "ngInject";
  const deferred = $q.defer();
  /** If the previous state was 'home' then
  ui-router resolves the 'authorization' state with 3s delay.
  In this time the title 'scrabble' is made shorter
  (by addding '--short' class to the title).
  */
  if ($transition$.from().name === "home") {
    $timeout(() => {
      deferred.resolve();
    }, appGlobals.delayedViewTime);
  } else {
    deferred.resolve();
  }
  return deferred.promise;
};
