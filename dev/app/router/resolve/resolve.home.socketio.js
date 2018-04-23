/* jshint esversion: 6 */
/** Authorize user via the cookies. */
module.exports = (
  socketFactory
) => {
  "ngInject";
  socketFactory.logSocket().then(() => {
    return true;
  });
};
