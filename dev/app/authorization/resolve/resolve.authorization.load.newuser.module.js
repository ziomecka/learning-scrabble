/* jshint esversion: 6 */
// TODO: https://stackoverflow.com/questions/37222466/how-to-split-code-in-webpack-with-require-ensure-for-production
module.exports = [
  "$q",
  "$ocLazyLoad",
  ($q, $ocLazyLoad) => {
    return $q((resolve) => {
      /** I use require.context insted of require.ensure
          because of 'error: require is undefined',
          which is supposed to be due to es6 syntax 'exports default'.
          */
      /** Load module. */
      let moduleContext = require.context("../../newuser/", true, /newuser.module.exports.js*$/);
      let module = moduleContext(moduleContext.keys()[0]);

      /** Load remaining files. Files with 'exports' excluded. */
      let context = require.context("../../newuser/", true, /^(?!.*\bexports\b).+js$/);
      // console.log(context.keys());
      context.keys().forEach(key => context(key));
      $ocLazyLoad.load({name: "newuserModule"});
      resolve(module);
    });
  }
];
