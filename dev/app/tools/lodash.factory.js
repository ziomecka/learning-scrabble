/* jshint esversion: 6 */
import has from "lodash/has";
import findKey from "lodash/findKey";
import remove from "lodash/remove";
import differenceWith from "lodash/differenceWith";

angular
  .module("app")
  .factory("lodashFactory", [
    "$window",
    ($window) => {
      if (!$window._) {
        return {
          has: has,
          findKey: findKey,
          remove: remove,
          differenceWith: differenceWith
        };
      } else {
        return $window._;
      }
    }
  ]);
