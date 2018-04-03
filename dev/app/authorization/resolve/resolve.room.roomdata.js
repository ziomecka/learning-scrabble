/* jshint esversion: 6 */
// TODO correct
/** Gets room's details */
module.exports = [
  "appService",
  "$q",
  (appService, $q) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    appService.getRoomDetails({
      callback: resolve
    });
  // TODO deferred.reject("failed to join the room")
  return deferred.promise;
  }
];
