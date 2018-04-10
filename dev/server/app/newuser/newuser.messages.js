/* jshint esversion: 6 */
module.exports = {
  loginAlreadyExists: login => `Login: ${login} already exists.`,
  userCreateSuccess: login => `User ${login} created.`,
  userCreateFailure: login => `User ${login} not created.`
};
