/* jshint esversion: 6 */
// TODO correct
/** Gets room's details */
module.exports = [
  "appTalkService",
  "$q",
  "$stateParams",
  (appTalkService, $q, $stateParams) => {
    const deferred = $q.defer();
    const resolve = data => deferred.resolve(data);
    const reject = () => deferred.reject("Failed to get room's details");

    appTalkService.getRoomDetails({
      roomId: $stateParams.roomId,
      callbacks: {
        success: data => {
          resolve(data);
        },
        failure: () => reject()
      }
    });
  return deferred.promise;
  }
];
