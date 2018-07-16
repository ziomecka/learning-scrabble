/* jshint esversion: 6 */
import has from "lodash/has";
import findKey from "lodash/findKey";
import remove from "lodash/remove";
import differenceWith from "lodash/differenceWith";
import intersection from "lodash/intersection";

const factory = ($window) => {
  "ngInject";

  if (!$window._) {
    return {
      has: has,
      findKey: findKey,
      remove: remove,
      differenceWith: differenceWith,
      intersection: intersection
    };
  } else {
    return $window._;
  }
};

angular // eslint-disable-line no-undef
  .module("app")
  .factory("lodashFactory", factory);
