/* jshint esversion: 6 */
/** Check if user is authorized.
    TODO can be removed?
    */
module.exports = [
  "userData",
  "$q",
  (userData, $q) => {
    const deferred = $q.defer();
    if (userData.authorized) {
      deferred.resolve(userData.login); // TODO correct?
    } else {
      deferred.reject("not authorized");
    }
    return deferred.promise;
  }
];
