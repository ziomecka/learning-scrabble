/* jshint esversion: 6 */
const factory = () => {
  const func = () => {
    /* eslint-disable no-undef */
    let root = angular.element(document.getElementsByTagName("body"));
    let watchers = [];
    let f = element => {
      angular.forEach(["$scope", "$isolateScope"], scopeProperty => {
        if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
          angular.forEach(element.data()[scopeProperty].$$watchers, watcher => {
            watchers.push(watcher);
          });
        }
      });
      angular.forEach(element.children(), childElement => {
        f(angular.element(childElement));
      });
    };

    f(root);

    // Remove duplicate watchers
    let watchersWithoutDuplicates = [];
    angular.forEach(watchers, item => {
      if(watchersWithoutDuplicates.indexOf(item) < 0) {
        watchersWithoutDuplicates.push(item);
      }
    });

    /* eslint-enable no-undef */
    console.log(`number of watches: ${watchersWithoutDuplicates.length}` + // eslint-disable-line no-console
      `${angular.toJson(watchersWithoutDuplicates)}`);
  };

  return func;
};

angular // eslint-disable-line no-undef
  .module("app")
  .factory("watchesNumberFactory", factory);
