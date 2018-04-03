/* jshint esversion: 6 */
/** Check if user is authorized.
    TODO can be removed?
    */
module.exports = [
  "authorizationService",
  "$q",
  (authorizationService, $q) => {
    const deferred = $q.defer();
    if (authorizationService.authorized) {
      deferred.resolve(authorizationService.user);
    } else {
      deferred.reject("not authorized");
    }
    return deferred.promise;
  }
];
