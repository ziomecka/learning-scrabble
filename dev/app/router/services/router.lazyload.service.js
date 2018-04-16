/* jshint esversion: 6 */
angular
  .module("routerModule")
  .service("routerLazyLoadService",
    function ($q, $ocLazyLoad) {
      "ngInject";
      this.load = mod => {
        return $q((resolve) => {
          /** I use require.context insted of require.ensure
          because of 'error: require is undefined',
          which is supposed to be due to es6 syntax 'exports default'.
          */
          let contexts = {
            newuser: {
                mod: () => require.context("../../newuser/", true, /newuser.module.exports.js*$/),
                files:  () => require.context("../../newuser/", true, /^(?!.*\bexports\b).+js$/)
            },
            authorization: {
                mod: () => require.context("../../authorization/", true, /authorization.module.exports.js*$/),
                files:  () => require.context("../../authorization/", true, /^(?!.*\bexports\b).+js$/)
            }
          };

          /** Load module. */
          let moduleContext = contexts[mod].mod();
          let module = moduleContext(moduleContext.keys()[0]);

          /** Load remaining files. Files with 'exports' excluded. */
          let filesContext = contexts[mod].files();
          filesContext.keys().forEach(key => filesContext(key));
          $ocLazyLoad.load({name: `${mod}Module`});

          resolve(module);
        });
      };
    });
