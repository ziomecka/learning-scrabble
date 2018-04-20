/* jshint esversion: 6 */
/** Initialised in ui-router */
module.exports = class AppController {
  constructor(
    $timeout,
    appSocket,
    appGlobals
  ) {
    "ngInject";

    Object.assign(this, {
      $timeout,
      appSocket,
      appGlobals
    });

    this.shortTitle = false;
    this.makeTitleShort();
  }

  makeTitleShort () {
    this.$timeout(() => {
      this.shortTitle = true;
    }, this.appGlobals.shorterTitleTime);
    this.appSocket.connection();
  }
};
