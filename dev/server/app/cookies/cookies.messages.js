/* jshint esversion: 6 */
module.exports = {
  authorizeCookiesSuccess: login => `User ${login} authorized via Number (cookies).`,
  authorizeCookiesFailure: login => `User ${login} not authorized via Number (cookies).`,
  authorizeCookiesSent: login => `Cookies sent to ${login}.`
};
