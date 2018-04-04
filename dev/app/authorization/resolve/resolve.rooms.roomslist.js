/* jshint esversion: 6 */
/** Gets list of rooms. */
module.exports = [
  "appTalkService",
  "$q",
  (appTalkService, $q) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    appTalkService.getAllRooms({callback: resolve});
    // TODO reject
    return deferred.promise;
  }
];
