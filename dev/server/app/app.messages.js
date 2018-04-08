/* jshint esversion: 6 */
// TODO coruupted data
module.exports = {
  roomCreateFailure: e => `Room not created: ${e}.`,
  gameCreateSuccess: id =>`Game ${id} created.`,
  gameCreateFailure: e =>`Game not created: ${e}.`,
  authorizeOption: data => `User ${data.login} being authorized via: ${data.option === "Number"? data.option + '(cookies)' : data.option}.`,
  loginAlreadyExists: login => `Login: ${login} already exists.`,
  userCreateSuccess: login => `User ${login} created.`,
  userCreateFailure: login => `User ${login} not created.`,
  authorizeSuccess: login => `User ${login} authorized.`,
  authorizeCookiesSuccess: login => `User ${login} authorized via Number (cookies).`,
  authorizeCookiesFailure: login => `User ${login} not authorized via Number (cookies).`,
  authorizeCookiesSent: login => `Cookies sent to ${login}.`,
  authorizePasswordFailure: login => `Incorrect ${login}'s password.'`,
  authorizeLoginFailure: login => `Login ${login} does not exist.'`,
  authorizeDataFailure: data => `Something went wrong. The data is corrupted?`
};
