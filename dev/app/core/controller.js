/* jshint esversion: 6 */
/** Initialised in ui-router */
module.exports = class AppController {
  constructor(
    $state,
    routerStates,
    appTitle
  ) {
    "ngInject";

    Object.assign(this, {
      $state,
      routerStates,
      appTitle
    });
  }

  get shortTitle () {
    return this.$state.$current.name !== this.routerStates.home;
  }

  get narrowTitle () {
    return this.$state.$current.name === this.routerStates.room;
  }
};
