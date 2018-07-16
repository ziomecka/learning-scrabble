/* jshint esversion: 6 */
import alphanum from "alphanum-sort";

const factory = () => {
  return alphanum;
};

angular // eslint-disable-line no-undef
  .module("app")
  .factory("alphanumSortFactory", factory);
