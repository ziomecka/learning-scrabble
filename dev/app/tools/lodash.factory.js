/* jshint esversion: 6 */
import has from "lodash/has";
import findKey from "lodash/findKey";
import remove from "lodash/remove";

angular
  .module("app")
  .factory("lodashFactory", [
    "$window",
    ($window) => {
      if (!$window._) {
        return {
          has: has,
          findKey: findKey,
          remove: remove
        };
      } else {
        return $window._;
      }
    }
  ]);
