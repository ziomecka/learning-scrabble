/* jshint esversion: 6 */
const constant = new Map([
  ["idle", "idle"],
  ["waiting", "waiting"],
  ["failureLogin", "failureLogin"],
  ["failurePassword", "failurePassword"],
  ["success", "success"],
  ["failureNotUnique", "failureNotUnique"],
  ["failureOther", "failureOther"]
]);

angular // eslint-disable-line no-undef
  .module("app")
  .constant("authorizationStates", constant);
