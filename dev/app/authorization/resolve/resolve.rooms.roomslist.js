/* jshint esversion: 6 */
/** Gets list of rooms. */
module.exports = [
  "appTalk",
  "$q",
  (appTalk, $q) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    appTalk.getAllRooms({callback: resolve});
    // TODO reject
    return deferred.promise;
  }
];
