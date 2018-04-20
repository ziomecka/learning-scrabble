/* jshint esversion: 6 */
angular
  .module("routerModule")
  .service("routerLazyLoadService",
    function ($q, $ocLazyLoad) {
      "ngInject";
      this.load = mod => {
        const deferred = $q.defer();

        /** Require.context insted of require.ensure
            because of 'error: require is undefined',
            which is supposed to be due to es6 syntax 'exports default'.
            */
        let contexts = {
          newuser: {
              mod: () => require.context("../../newuser/", true, /newuser.module.exports.js$/),
              files: () => require.context("../../newuser/", true, /^(?!.*\bexports\b).+js$/)
          },
          authorization: {
              mod: () => require.context("../../authorization/", true, /authorization.module.exports.js$/),
              files: () => require.context("../../authorization/", true, /^(?!.*\bexports\b).+js$/)
          },
          rooms: {
              mod: () => require.context("../../rooms/", true, /rooms.module.exports.js$/),
              files: () => require.context("../../rooms/", true, /^(?!.*\bexports\b).+js$/)
          },
          room: {
              mod: () => require.context("../../room/", true, /room.module.exports.js$/),
              files: () => require.context("../../room/", true, /^(?!.*\bexports\b).+js$/)
          },
          scrabble: {
              mod: () => require.context("../../scrabble/core/", true, /scrabble.module.exports.js$/),
              files: () => require.context("../../scrabble/core/", true, /^(?!.*\bexports\b).+js$/)
          },
          observer: {
            mod: () => require.context("../../scrabble/observer/", true, /observer.module.exports.js$/),
            files: () => require.context("../../scrabble/observer", true, /^(?!.*\bexports\b).+js$/)
          },
          player: {
            mod: () => require.context("../../scrabble/player/", true, /player.module.exports.js$/),
            files: () => require.context("../../scrabble/player/", true, /^(?!.*\bexports\b).+js$/)
          }
        };

        /** Require module. */
        let moduleContext = contexts[mod].mod();
        let module = moduleContext(moduleContext.keys()[0]);

        /** Require remaining files. Files with 'exports' excluded. */
        let filesContext = contexts[mod].files();
        filesContext.keys().forEach(key => filesContext(key));

        /** Load module */
        $ocLazyLoad
        .load({name: `${mod}Module`})
        .then(() => {
          deferred.resolve(module);
        });

        return deferred.promise;
      };
    });
