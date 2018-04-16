/* jshint esversion: 6 */
/** Gets list of rooms. */
module.exports = (appSocket, $q) => {
  // roomsSocket
  "ngInject";
  const deferred = $q.defer();
  const resolve = data => deferred.resolve(data);
  appSocket.getAllRooms({callback: resolve});
  // TODO reject
  return deferred.promise;
};
