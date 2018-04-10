/* jshint esversion: 6 */
module.exports = {
  authorizeOption: data => `User ${data.login} being authorized via: ${data.option === "Number"? data.option + '(cookies)' : data.option}.`,
  authorizeSuccess: login => `User ${login} authorized.`,
  authorizePasswordFailure: login => `Incorrect ${login}'s password.'`,
  authorizeLoginFailure: login => `Login ${login} does not exist.'`,
  authorizeDataFailure: data => `Something went wrong. The data is corrupted?`
};
