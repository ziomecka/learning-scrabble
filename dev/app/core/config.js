/* jshint esversion: 6 */
const func = (
  dynamicDirectiveServiceProvider,
  $compileProvider,
  $animateProvider
) => {
  "ngInject";
  $compileProvider.debugInfoEnabled(true);
  /** Grab the $compileProvider. */
  dynamicDirectiveServiceProvider.compileProvider = $compileProvider;

  $animateProvider.classNameFilter(/animate-/);
};

angular // eslint-disable-line no-undef
  .module("app")
  .config(func);
