/* jshint esversion: 6 */
// TODO correct
/** Gets room's details */
module.exports = [
  "appTalk",
  "$q",
  (appTalk, $q) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    appTalk.getRoomDetails({
      callback: resolve
    });
  // TODO deferred.reject("failed to join the room")
  return deferred.promise;
  }
];
