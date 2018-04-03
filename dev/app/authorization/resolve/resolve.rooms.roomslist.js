/* jshint esversion: 6 */
/** Gets list of rooms. */
module.exports = [
  "appService",
  "$q",
  (appService, $q) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    appService.getAllRooms({callback: resolve});
    // TODO reject
    return deferred.promise;
  }
];
